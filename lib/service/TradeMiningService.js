"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeMiningService = void 0;
const BaseService_1 = require("./BaseService");
const ConnectInfo_1 = require("../ConnectInfo");
const tool_1 = require("./tool");
const vo_1 = require("./vo");
const Erc20Service_1 = require("./Erc20Service");
const IBananaClaimable_1 = require("./abi/IBananaClaimable");
const IPair_1 = require("./abi/IPair");
const abi_1 = require("./abi");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ITWAMMInstantSwap_1 = require("./abi/ITWAMMInstantSwap");
const BasicException_1 = require("../BasicException");
/**
 * Bond API
 */
let TradeMiningService = class TradeMiningService extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    async prizePool() {
        const user = this.connectInfo.account;
        const apiService = this.connectInfo.api();
        const [{ amount }, { bananaPrice, rate }] = await Promise.all([
            this.connectInfo.create(Erc20Service_1.Erc20Service).getBalance(this.addressInfo.banana, user),
            apiService.tradeMiningApi().getBananaRate()
        ]);
        const tradeMiningPrizePool = new vo_1.TradeMiningPrizePool();
        tradeMiningPrizePool.availableBalance = amount;
        tradeMiningPrizePool.price = bananaPrice;
        tradeMiningPrizePool.redeemRate = rate;
        return tradeMiningPrizePool;
    }
    async claim(user, useFor, amount, expireAt, nonce, signature) {
        const bananaClaimable = this.connectInfo.create(IBananaClaimable_1.IBananaClaimable);
        return await bananaClaimable.claim(user, useFor, amount, expireAt, nonce, signature);
    }
    async swapBalance() {
        const user = this.connectInfo.account;
        const [[bananaResult, usdcResult], { rate, bananaPrice, totalSpents, boostUpRates, kline }] = await Promise.all([
            this.connectInfo.multiCall().call(...[this.connectInfo.addressInfo.banana, this.connectInfo.addressInfo.usdc].map((it) => {
                const tokenIns = this.connectInfo.create(abi_1.ERC20, it);
                return {
                    balance: tokenIns.erc20Instance.balanceOf(user),
                    decimals: tokenIns.erc20Instance.decimals(),
                    allowance: tokenIns.erc20Instance.allowance(user, this.connectInfo.addressInfo.twammRouter)
                };
            })),
            this.connectInfo.api().tradeMiningApi().getSwapInfo()
        ]);
        const tradeMiningSwapBalance = new vo_1.TradeMiningSwapBalance();
        tradeMiningSwapBalance.bananaBalance = new bignumber_js_1.default(bananaResult.balance)
            .div(10 ** bananaResult.decimals)
            .toFixed();
        tradeMiningSwapBalance.usdcBalance = new bignumber_js_1.default(usdcResult.balance).div(10 ** usdcResult.decimals).toFixed();
        tradeMiningSwapBalance.showBananaApprove =
            new bignumber_js_1.default(new bignumber_js_1.default(bananaResult.allowance).div(10 ** bananaResult.decimals)).comparedTo("100000000") <=
                0;
        tradeMiningSwapBalance.showUsdcApprove =
            new bignumber_js_1.default(new bignumber_js_1.default(usdcResult.allowance).div(10 ** usdcResult.decimals)).comparedTo("100000000") <= 0;
        tradeMiningSwapBalance.totalSpent = totalSpents;
        tradeMiningSwapBalance.currentRate = rate;
        tradeMiningSwapBalance.currentPrice = bananaPrice;
        tradeMiningSwapBalance.boostUpRate = boostUpRates;
        tradeMiningSwapBalance.kline = kline;
        tradeMiningSwapBalance.approveBanana = () => {
            return this.connectInfo.erc20().approve(this.connectInfo.addressInfo.twammRouter, this.addressInfo.banana);
        };
        tradeMiningSwapBalance.approveUsdc = () => {
            return this.connectInfo.erc20().approve(this.connectInfo.addressInfo.twammRouter, this.addressInfo.usdc);
        };
        return tradeMiningSwapBalance;
    }
    async swapInfo(token, amount, slippage, deadline) {
        const user = this.connectInfo.account;
        const pair = this.connectInfo.create(IPair_1.IPair);
        const banana = this.connectInfo.create(abi_1.ERC20, this.addressInfo.banana);
        const usdc = this.connectInfo.create(abi_1.ERC20, this.addressInfo.usdc);
        const [{ tokenAReserves, tokenBReserves, tokenB }, bananaBalance, usdcBalance] = await this.connectInfo
            .multiCall()
            .call({
            tokenAReserves: pair.pairInstance.tokenAReserves(),
            tokenBReserves: pair.pairInstance.tokenBReserves(),
            tokenB: pair.pairInstance.tokenB()
        }, {
            balance: banana.erc20Instance.balanceOf(user),
            decimals: banana.erc20Instance.decimals()
        }, {
            balance: usdc.erc20Instance.balanceOf(user),
            decimals: usdc.erc20Instance.decimals()
        });
        const preSwapInfo = new vo_1.TradeMiningPreSwapInfo();
        let bananaReserves = tokenAReserves;
        let usdcReserves = tokenBReserves;
        if ((0, tool_1.eqAddress)(this.addressInfo.banana, tokenB)) {
            bananaReserves = tokenBReserves;
            usdcReserves = tokenAReserves;
        }
        const inputIsBanana = token === "banana";
        const amountIn = new bignumber_js_1.default(amount)
            .multipliedBy(10 ** (inputIsBanana ? bananaBalance : usdcBalance).decimals)
            .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        let amountOut;
        let amountOutMin;
        {
            const reserveIn = inputIsBanana ? bananaReserves : usdcReserves;
            const reserveOut = inputIsBanana ? usdcReserves : bananaReserves;
            amountOut = tool_1.MathTool.getAmountOut(amountIn, reserveIn, reserveOut);
            preSwapInfo.outTokenAmount = new bignumber_js_1.default(amountOut)
                .div(10 ** (inputIsBanana ? usdcBalance : bananaBalance).decimals)
                .toFixed();
            amountOutMin = bignumber_js_1.default.max(0, new bignumber_js_1.default(amountOut).multipliedBy(new bignumber_js_1.default(1).minus(slippage))).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            preSwapInfo.impact = tool_1.MathTool.impact(amountIn, amountOut, reserveIn, reserveOut);
        }
        preSwapInfo.price = new bignumber_js_1.default(new bignumber_js_1.default(usdcReserves).div(10 ** usdcBalance.decimals))
            .div(new bignumber_js_1.default(bananaReserves).div(10 ** bananaBalance.decimals))
            .toFixed();
        preSwapInfo.inputToken = inputIsBanana ? "banana" : "usdc";
        preSwapInfo.outToken = inputIsBanana ? "usdc" : "banana";
        preSwapInfo.inputTokenAmount = amount;
        preSwapInfo.swap = () => {
            if (new bignumber_js_1.default(amountOut).comparedTo("0") <= 0) {
                throw new BasicException_1.BasicException("amountOut <= 0");
            }
            const swap = this.connectInfo.create(ITWAMMInstantSwap_1.ITWAMMInstantSwap);
            const transactionEventPromise = swap.instantSwapTokenToToken(inputIsBanana ? this.addressInfo.banana : this.addressInfo.usdc, inputIsBanana ? this.addressInfo.usdc : this.addressInfo.banana, amountIn, amountOutMin, tool_1.MathTool.deadline(deadline));
            return transactionEventPromise;
        };
        return preSwapInfo;
    }
    async redeemInfo() {
        const user = this.connectInfo.account;
        const banana = this.connectInfo.create(abi_1.ERC20, this.addressInfo.banana);
        const apex = this.connectInfo.create(abi_1.ERC20, this.addressInfo.apex);
        const [bananaBalance, apexBalance] = await this.connectInfo
            .multiCall()
            .call({
            balance: banana.erc20Instance.balanceOf(user),
            totalSupply: banana.erc20Instance.totalSupply(),
            decimals: banana.erc20Instance.decimals()
        }, {
            balance: apex.erc20Instance.balanceOf(this.addressInfo.banana),
            decimals: apex.erc20Instance.decimals()
        });
        const tradeMiningRedeem = new vo_1.TradeMiningRedeem();
        tradeMiningRedeem.bananaBalance = new bignumber_js_1.default(bananaBalance.balance).div(10 ** bananaBalance.decimals).toFixed();
        tradeMiningRedeem.redeem = async (amount) => {
            const bananaIns = this.connectInfo.create(abi_1.IBanana, this.addressInfo.banana);
            return bananaIns.redeem(amount);
        };
        tradeMiningRedeem.calcApexReward = async (amount) => {
            // uint256 apeXAmount = amount * totalApeX / totalSupply / 1000;
            return new bignumber_js_1.default(amount).multipliedBy(10 ** bananaBalance.decimals)
                .multipliedBy(apexBalance.balance)
                .div(bananaBalance.totalSupply)
                .div(1000)
                .div(10 ** apexBalance.decimals)
                .toFixed();
        };
        tradeMiningRedeem.apexRate = await tradeMiningRedeem.calcApexReward("1");
        return tradeMiningRedeem;
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TradeMiningService.prototype, "claim", null);
TradeMiningService = __decorate([
    (0, tool_1.CacheKey)("TradeMiningService"),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], TradeMiningService);
exports.TradeMiningService = TradeMiningService;
