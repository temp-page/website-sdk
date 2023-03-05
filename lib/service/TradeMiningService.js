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
const abi_1 = require("./abi");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const BasicException_1 = require("../BasicException");
const api_1 = require("./api");
const lodash_1 = __importDefault(require("lodash"));
/**
 * Bond API
 */
let TradeMiningService = class TradeMiningService extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    async prizePool() {
        const apiService = this.connectInfo.api();
        const user = this.connectInfo.account;
        const banana = this.connectInfo.create(abi_1.ERC20, this.addressInfo.banana);
        const pair = this.connectInfo.create(abi_1.ERC20, this.addressInfo.pair);
        const [[bananaBalance, lpBalance], executeVirtualOrdersResult, { bananaApexRateLogs }] = await Promise.all([
            this.connectInfo.multiCall().call({
                balance: banana.erc20Instance.balanceOf(user),
            }, {
                balance: pair.erc20Instance.balanceOf(user),
                totalSupply: pair.erc20Instance.totalSupply(),
            }),
            apiService.tradeMiningApi().executeVirtualOrders(),
            apiService.baseApi.bananaGraph((0, api_1.getBananaApexRateLogs)(), {}),
        ]);
        const totalSupply = lpBalance.totalSupply;
        let bananaReserves = executeVirtualOrdersResult.reserveA;
        let usdcReserves = executeVirtualOrdersResult.reserveB;
        if ((0, tool_1.eqAddress)(this.addressInfo.banana, executeVirtualOrdersResult.tokenB)) {
            bananaReserves = executeVirtualOrdersResult.reserveB;
            usdcReserves = executeVirtualOrdersResult.reserveA;
        }
        const lpTokenValue = new bignumber_js_1.default(lpBalance.balance).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        const shareOfPool = new bignumber_js_1.default(lpTokenValue).div(totalSupply).multipliedBy('100').toFixed();
        const bananaValue = new bignumber_js_1.default(lpTokenValue)
            .multipliedBy(bananaReserves)
            .div(totalSupply)
            .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        const usdcValue = new bignumber_js_1.default(lpTokenValue)
            .multipliedBy(usdcReserves)
            .div(totalSupply)
            .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        const bananaAmount = new bignumber_js_1.default(bananaValue).div(1e18).toFixed();
        const usdcAmount = new bignumber_js_1.default(usdcValue).div(1e6).toFixed();
        const tradeMiningPrizePool = new vo_1.TradeMiningPrizePool();
        tradeMiningPrizePool.availableBalance = new bignumber_js_1.default(bananaBalance.balance).div(1e18).toFixed();
        tradeMiningPrizePool.price = new bignumber_js_1.default(usdcReserves)
            .div(1e6)
            .div(new bignumber_js_1.default(bananaReserves).div(1e18))
            .toFixed();
        tradeMiningPrizePool.redeemRate = lodash_1.default.get(bananaApexRateLogs, '[0].rate', '0');
        // 新增
        tradeMiningPrizePool.lpTokenBalance = new bignumber_js_1.default(lpBalance.balance).div(1e18).toFixed();
        tradeMiningPrizePool.pooledUsdc = usdcAmount;
        tradeMiningPrizePool.pooledBanana = bananaAmount;
        tradeMiningPrizePool.shareOfPool = shareOfPool;
        return tradeMiningPrizePool;
    }
    async claim(user, useFor, accountId, amount, expireAt, nonce, signature) {
        const bananaClaimable = this.connectInfo.create(abi_1.IBananaClaimable);
        amount = new bignumber_js_1.default(amount).multipliedBy(1e18).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        const transactionEvent = await bananaClaimable.claim(user, useFor, accountId, amount, expireAt, nonce, signature);
        return transactionEvent;
    }
    async swapBalance() {
        const user = this.connectInfo.account;
        const [[bananaResult, usdcResult], { rate, bananaPrice, totalSpents, boostUpRates, bananaBurns }] = await Promise.all([
            this.connectInfo.multiCall().call(...[this.connectInfo.addressInfo.banana, this.connectInfo.addressInfo.usdc].map((it) => {
                const tokenIns = this.connectInfo.create(abi_1.ERC20, it);
                return {
                    balance: tokenIns.erc20Instance.balanceOf(user),
                    decimals: tokenIns.erc20Instance.decimals(),
                    allowance: tokenIns.erc20Instance.allowance(user, this.connectInfo.addressInfo.twammRouter),
                };
            })),
            this.connectInfo.api().tradeMiningApi().getSwapInfo(),
        ]);
        const tradeMiningSwapBalance = new vo_1.TradeMiningSwapBalance();
        tradeMiningSwapBalance.bananaBalance = new bignumber_js_1.default(bananaResult.balance)
            .div(10 ** bananaResult.decimals)
            .toFixed();
        tradeMiningSwapBalance.usdcBalance = new bignumber_js_1.default(usdcResult.balance).div(10 ** usdcResult.decimals).toFixed();
        tradeMiningSwapBalance.showBananaApprove = (0, tool_1.showApprove)(bananaResult);
        tradeMiningSwapBalance.bananaAllowance = new bignumber_js_1.default(bananaResult.allowance)
            .div(10 ** bananaResult.decimals)
            .toFixed();
        tradeMiningSwapBalance.showUsdcApprove = (0, tool_1.showApprove)(usdcResult);
        tradeMiningSwapBalance.showUsdcAllowance = new bignumber_js_1.default(usdcResult.allowance)
            .div(10 ** usdcResult.decimals)
            .toFixed();
        tradeMiningSwapBalance.totalSpent = totalSpents;
        tradeMiningSwapBalance.currentRate = rate;
        tradeMiningSwapBalance.currentPrice = bananaPrice;
        tradeMiningSwapBalance.boostUpRate = boostUpRates;
        tradeMiningSwapBalance.bananaBurns = bananaBurns;
        tradeMiningSwapBalance.kline = [];
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
        const banana = this.connectInfo.create(abi_1.ERC20, this.addressInfo.banana);
        const usdc = this.connectInfo.create(abi_1.ERC20, this.addressInfo.usdc);
        const executeVirtualOrdersResult = await this.connectInfo.api().tradeMiningApi().executeVirtualOrders();
        const [bananaBalance, usdcBalance] = await this.connectInfo.multiCall().call({
            balance: banana.erc20Instance.balanceOf(user),
            decimals: banana.erc20Instance.decimals(),
        }, {
            balance: usdc.erc20Instance.balanceOf(user),
            decimals: usdc.erc20Instance.decimals(),
        });
        const preSwapInfo = new vo_1.TradeMiningPreSwapInfo();
        let bananaReserves = executeVirtualOrdersResult.reserveA;
        let usdcReserves = executeVirtualOrdersResult.reserveB;
        if ((0, tool_1.eqAddress)(this.addressInfo.banana, executeVirtualOrdersResult.tokenB)) {
            bananaReserves = executeVirtualOrdersResult.reserveB;
            usdcReserves = executeVirtualOrdersResult.reserveA;
        }
        tool_1.Trace.debug('executeVirtualOrdersResult', executeVirtualOrdersResult);
        tool_1.Trace.debug('bananaReserves', bananaReserves, 'usdcReserves', usdcReserves);
        const inputIsBanana = token === 'banana';
        const amountIn = new bignumber_js_1.default(amount)
            .multipliedBy(10 ** (inputIsBanana ? bananaBalance : usdcBalance).decimals)
            .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        let amountOut;
        let amountOutMin;
        let price;
        {
            const reserveIn = inputIsBanana ? bananaReserves : usdcReserves;
            const reserveOut = inputIsBanana ? usdcReserves : bananaReserves;
            amountOut = tool_1.MathTool.getAmountOut(amountIn, reserveIn, reserveOut);
            preSwapInfo.outTokenAmount = new bignumber_js_1.default(amountOut)
                .div(10 ** (inputIsBanana ? usdcBalance : bananaBalance).decimals)
                .toFixed();
            price = new bignumber_js_1.default(usdcReserves)
                .div(10 ** usdcBalance.decimals)
                .div(new bignumber_js_1.default(bananaReserves).div(10 ** bananaBalance.decimals))
                .toFixed();
            //
            let amountOutValueMin = new bignumber_js_1.default(amount)
                .div(price)
                .multipliedBy(10 ** bananaBalance.decimals)
                .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            if (inputIsBanana) {
                amountOutValueMin = new bignumber_js_1.default(amount)
                    .multipliedBy(price)
                    .multipliedBy(10 ** usdcBalance.decimals)
                    .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            }
            amountOutMin = bignumber_js_1.default.max(0, new bignumber_js_1.default(amountOutValueMin).multipliedBy(new bignumber_js_1.default(1).minus(slippage))).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            preSwapInfo.impact = tool_1.MathTool.impact(amountIn, amountOut, reserveIn, reserveOut);
        }
        preSwapInfo.price = price;
        preSwapInfo.bananaUsdcRate = new bignumber_js_1.default(new bignumber_js_1.default(usdcReserves).div(10 ** usdcBalance.decimals))
            .div(new bignumber_js_1.default(bananaReserves).div(10 ** bananaBalance.decimals))
            .toFixed();
        preSwapInfo.usdcBananaRate = new bignumber_js_1.default(bananaReserves)
            .div(10 ** bananaBalance.decimals)
            .div(new bignumber_js_1.default(new bignumber_js_1.default(usdcReserves).div(10 ** usdcBalance.decimals)))
            .toFixed();
        preSwapInfo.inputToken = inputIsBanana ? 'banana' : 'usdc';
        preSwapInfo.outToken = inputIsBanana ? 'usdc' : 'banana';
        preSwapInfo.inputTokenAmount = amount;
        preSwapInfo.swap = () => {
            if (new bignumber_js_1.default(amountOut).comparedTo('0') <= 0) {
                throw new BasicException_1.BasicException('amountOut <= 0');
            }
            const swap = this.connectInfo.create(abi_1.ITWAMMInstantSwap);
            const transactionEventPromise = swap.instantSwapTokenToToken(inputIsBanana ? this.addressInfo.banana : this.addressInfo.usdc, inputIsBanana ? this.addressInfo.usdc : this.addressInfo.banana, amountIn, amountOutMin, tool_1.MathTool.deadline(deadline));
            return transactionEventPromise;
        };
        return preSwapInfo;
    }
    async redeemInfo() {
        const user = this.connectInfo.account;
        const banana = this.connectInfo.create(abi_1.ERC20, this.addressInfo.banana);
        const bananaIns = this.connectInfo.create(abi_1.IBanana, this.addressInfo.banana);
        const apex = this.connectInfo.create(abi_1.ERC20, this.addressInfo.apex);
        const [bananaBalance, apexBalance, { blockTime }] = await this.connectInfo.multiCall().call({
            balance: banana.erc20Instance.balanceOf(user),
            totalSupply: banana.erc20Instance.totalSupply(),
            decimals: banana.erc20Instance.decimals(),
            redeemTime: bananaIns.bananaInstance.redeemTime(),
        }, {
            balance: apex.erc20Instance.balanceOf(this.addressInfo.banana),
            decimals: apex.erc20Instance.decimals(),
        }, {
            blockTime: this.connectInfo.multiCall().multicall2Instance.getCurrentBlockTimestamp(),
        });
        const tradeMiningRedeem = new vo_1.TradeMiningRedeem();
        tradeMiningRedeem.bananaBalance = new bignumber_js_1.default(bananaBalance.balance).div(10 ** bananaBalance.decimals).toFixed();
        tradeMiningRedeem.redeem = async (amount) => {
            return bananaIns.redeem(new bignumber_js_1.default(amount).multipliedBy(10 ** bananaBalance.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN));
        };
        tradeMiningRedeem.calcApexReward = async (amount) => {
            // uint256 apeXAmount = amount * totalApeX / totalSupply ;
            return new bignumber_js_1.default(amount)
                .multipliedBy(10 ** bananaBalance.decimals)
                .multipliedBy(apexBalance.balance)
                .div(bananaBalance.totalSupply)
                .div(10 ** apexBalance.decimals)
                .toFixed();
        };
        tradeMiningRedeem.apexRate = await tradeMiningRedeem.calcApexReward('1');
        tradeMiningRedeem.redeemTime = bananaBalance.redeemTime;
        tradeMiningRedeem.currentTime = blockTime;
        return tradeMiningRedeem;
    }
    async liquidityInfo() {
        const user = this.connectInfo.account;
        const banana = this.connectInfo.create(abi_1.ERC20, this.addressInfo.banana);
        const usdc = this.connectInfo.create(abi_1.ERC20, this.addressInfo.usdc);
        const pair = this.connectInfo.create(abi_1.ERC20, this.addressInfo.pair);
        const [bananaBalance, usdcBalance, lpBalance] = await this.connectInfo.multiCall().call({
            balance: banana.erc20Instance.balanceOf(user),
            decimals: banana.erc20Instance.decimals(),
            allowance: banana.erc20Instance.allowance(user, this.connectInfo.addressInfo.twammRouter),
        }, {
            balance: usdc.erc20Instance.balanceOf(user),
            decimals: usdc.erc20Instance.decimals(),
            allowance: usdc.erc20Instance.allowance(user, this.connectInfo.addressInfo.twammRouter),
        }, {
            balance: pair.erc20Instance.balanceOf(user),
            decimals: pair.erc20Instance.decimals(),
            allowance: pair.erc20Instance.allowance(user, this.connectInfo.addressInfo.twammRouter),
        });
        const tradeMiningLiquidity = new vo_1.TradeMiningLiquidity();
        tradeMiningLiquidity.bananaBalance = new bignumber_js_1.default(bananaBalance.balance)
            .div(10 ** bananaBalance.decimals)
            .toFixed();
        tradeMiningLiquidity.showBananaApprove = (0, tool_1.showApprove)(bananaBalance);
        tradeMiningLiquidity.bananaAllowance = new bignumber_js_1.default(bananaBalance.allowance)
            .div(10 ** bananaBalance.decimals)
            .toFixed();
        tradeMiningLiquidity.usdcBalance = new bignumber_js_1.default(usdcBalance.balance).div(10 ** usdcBalance.decimals).toFixed();
        tradeMiningLiquidity.showUsdcApprove = (0, tool_1.showApprove)(usdcBalance);
        tradeMiningLiquidity.usdcAllowance = new bignumber_js_1.default(usdcBalance.allowance).div(10 ** usdcBalance.decimals).toFixed();
        tradeMiningLiquidity.lpBalance = new bignumber_js_1.default(lpBalance.balance).div(10 ** lpBalance.decimals).toFixed();
        tradeMiningLiquidity.showLpApprove = (0, tool_1.showApprove)(lpBalance);
        tradeMiningLiquidity.lpAllowance = new bignumber_js_1.default(lpBalance.allowance).div(10 ** lpBalance.decimals).toFixed();
        tradeMiningLiquidity.currentPrice = (await this.connectInfo.api().tradeMiningApi().getBananaPrice()).price;
        tradeMiningLiquidity.approveBanana = () => {
            return this.connectInfo.erc20().approve(this.connectInfo.addressInfo.twammRouter, this.addressInfo.banana);
        };
        tradeMiningLiquidity.approveUsdc = () => {
            return this.connectInfo.erc20().approve(this.connectInfo.addressInfo.twammRouter, this.addressInfo.usdc);
        };
        tradeMiningLiquidity.approveLp = () => {
            return this.connectInfo.erc20().approve(this.connectInfo.addressInfo.twammRouter, this.addressInfo.pair);
        };
        tradeMiningLiquidity.preAddLiquidity = async (inputToken, inputTokenAmount) => {
            const executeVirtualOrdersResult = await (0, api_1.executeVirtualOrders)(this.connectInfo);
            const [{ totalSupply }] = await this.connectInfo.multiCall().call({
                totalSupply: pair.erc20Instance.totalSupply(),
            });
            let bananaReserves = executeVirtualOrdersResult.reserveA;
            let usdcReserves = executeVirtualOrdersResult.reserveB;
            if ((0, tool_1.eqAddress)(this.addressInfo.banana, executeVirtualOrdersResult.tokenB)) {
                bananaReserves = executeVirtualOrdersResult.reserveB;
                usdcReserves = executeVirtualOrdersResult.reserveA;
            }
            let bananaValue;
            let usdcValue;
            let bananaAmount;
            let usdcAmount;
            if (inputToken === 'banana') {
                bananaAmount = inputTokenAmount;
                bananaValue = new bignumber_js_1.default(bananaAmount)
                    .multipliedBy(10 ** bananaBalance.decimals)
                    .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
                usdcValue = tool_1.MathTool.quote(bananaValue, bananaReserves, usdcReserves);
                usdcAmount = new bignumber_js_1.default(usdcValue).div(10 ** usdcBalance.decimals).toFixed();
            }
            else {
                usdcAmount = inputTokenAmount;
                usdcValue = new bignumber_js_1.default(usdcAmount).multipliedBy(10 ** usdcBalance.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
                bananaValue = tool_1.MathTool.quote(usdcValue, usdcReserves, bananaReserves);
                bananaAmount = new bignumber_js_1.default(bananaValue).div(10 ** bananaBalance.decimals).toFixed();
            }
            //  liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
            const lpTokenValue = bignumber_js_1.default.min(new bignumber_js_1.default(bananaValue).multipliedBy(totalSupply).div(bananaReserves).dp(0, bignumber_js_1.default.ROUND_DOWN), new bignumber_js_1.default(usdcValue).multipliedBy(totalSupply).div(usdcReserves).dp(0, bignumber_js_1.default.ROUND_DOWN))
                .multipliedBy('0.999')
                .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            const lpTokenAmount = new bignumber_js_1.default(lpTokenValue).div(10 ** lpBalance.decimals).toFixed();
            const shareOfPool = new bignumber_js_1.default(lpTokenValue)
                .div(new bignumber_js_1.default(totalSupply).plus(lpTokenValue))
                .multipliedBy('100')
                .toFixed();
            return {
                banana: bananaAmount,
                usdc: usdcAmount,
                lpToken: lpTokenAmount,
                shareOfPool,
                bananaPrice: new bignumber_js_1.default(usdcReserves).div(1e6).div(new bignumber_js_1.default(bananaReserves).div(1e18)).toFixed(),
            };
        };
        tradeMiningLiquidity.addLiquidity = (lpTokenAmount, deadline) => {
            if (new bignumber_js_1.default(lpTokenAmount).comparedTo('0') <= 0) {
                throw new BasicException_1.BasicException('lpTokenAmount <= 0');
            }
            const instantSwap = this.connectInfo.create(abi_1.ITWAMMInstantSwap);
            return instantSwap.addLiquidity(this.addressInfo.banana, this.addressInfo.usdc, new bignumber_js_1.default(lpTokenAmount).multipliedBy(10 ** lpBalance.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN), tool_1.MAXIMUM_U256, tool_1.MAXIMUM_U256, tool_1.MathTool.deadline(deadline));
        };
        tradeMiningLiquidity.preRemoveLiquidity = async (lpTokenAmount) => {
            const executeVirtualOrdersResult = await (0, api_1.executeVirtualOrders)(this.connectInfo);
            const [{ totalSupply }] = await this.connectInfo.multiCall().call({
                totalSupply: pair.erc20Instance.totalSupply(),
            });
            let bananaReserves = executeVirtualOrdersResult.reserveA;
            let usdcReserves = executeVirtualOrdersResult.reserveB;
            if ((0, tool_1.eqAddress)(this.addressInfo.banana, executeVirtualOrdersResult.tokenB)) {
                bananaReserves = executeVirtualOrdersResult.reserveB;
                usdcReserves = executeVirtualOrdersResult.reserveA;
            }
            const lpTokenValue = new bignumber_js_1.default(lpTokenAmount)
                .multipliedBy(10 ** lpBalance.decimals)
                .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            const shareOfPool = new bignumber_js_1.default(lpTokenValue).div(totalSupply).multipliedBy('100').toFixed();
            const bananaValue = new bignumber_js_1.default(lpTokenValue)
                .multipliedBy(bananaReserves)
                .div(totalSupply)
                .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            const usdcValue = new bignumber_js_1.default(lpTokenValue)
                .multipliedBy(usdcReserves)
                .div(totalSupply)
                .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            const bananaAmount = new bignumber_js_1.default(bananaValue).div(10 ** bananaBalance.decimals).toFixed();
            const usdcAmount = new bignumber_js_1.default(usdcValue).div(10 ** usdcBalance.decimals).toFixed();
            return {
                banana: bananaAmount,
                usdc: usdcAmount,
                lpToken: lpTokenAmount,
                shareOfPool,
                bananaPrice: new bignumber_js_1.default(usdcReserves).div(1e6).div(new bignumber_js_1.default(bananaReserves).div(1e18)).toFixed(),
            };
        };
        tradeMiningLiquidity.removeLiquidity = (lpTokenAmount, deadline) => {
            if (new bignumber_js_1.default(lpTokenAmount).comparedTo('0') <= 0) {
                throw new BasicException_1.BasicException('lpTokenAmount <= 0');
            }
            const instantSwap = this.connectInfo.create(abi_1.ITWAMMInstantSwap);
            return instantSwap.withdrawLiquidity(this.addressInfo.banana, this.addressInfo.usdc, new bignumber_js_1.default(lpTokenAmount).multipliedBy(10 ** lpBalance.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN), '0', '0', tool_1.MathTool.deadline(deadline));
        };
        return tradeMiningLiquidity;
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TradeMiningService.prototype, "claim", null);
TradeMiningService = __decorate([
    (0, tool_1.CacheKey)('TradeMiningService'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], TradeMiningService);
exports.TradeMiningService = TradeMiningService;
