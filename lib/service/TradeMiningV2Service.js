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
exports.TradeMiningV2Service = void 0;
const BaseService_1 = require("./BaseService");
const ConnectInfo_1 = require("../ConnectInfo");
const tool_1 = require("./tool");
const vo_1 = require("./vo");
const abi_1 = require("./abi");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
/**
 * Bond API
 */
let TradeMiningV2Service = class TradeMiningV2Service extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    async claim(user, useFor, accountId, amount, expireAt, nonce, signature) {
        const bananaClaimable = this.connectInfo.create(abi_1.IBananaClaimableV2);
        amount = new bignumber_js_1.default(amount).multipliedBy(1e18).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        const transactionEvent = await bananaClaimable.claim(user, useFor, accountId, amount, expireAt, nonce, signature);
        return transactionEvent;
    }
    async redeemInfo() {
        const user = this.connectInfo.account;
        const banana = this.connectInfo.create(abi_1.ERC20, this.addressInfo.bananaV2);
        const bananaIns = this.connectInfo.create(abi_1.IBananaV2);
        const apex = this.connectInfo.create(abi_1.ERC20, this.addressInfo.apexV2);
        const [bananaBalance, apexBalance, { blockTime }] = await this.connectInfo.multiCall().call({
            balance: banana.erc20Instance.balanceOf(user),
            totalSupply: banana.erc20Instance.totalSupply(),
            decimals: banana.erc20Instance.decimals(),
            redeemTime: bananaIns.bananaInstance.redeemTime(),
        }, {
            balance: apex.erc20Instance.balanceOf(this.addressInfo.bananaV2),
            decimals: apex.erc20Instance.decimals(),
        }, {
            blockTime: this.connectInfo.multiCall().multicall2Instance.getCurrentBlockTimestamp(),
        });
        const tradeMiningRedeem = new vo_1.TradeMiningRedeemV2();
        tradeMiningRedeem.bananaBalance = new bignumber_js_1.default(bananaBalance.balance).div(10 ** bananaBalance.decimals).toFixed();
        tradeMiningRedeem.bananaPrice = (await this.connectInfo.addressInfo.getApiService().tradeMiningV2Api().getBananaPrice()).price;
        tradeMiningRedeem.bananaUsdt = new bignumber_js_1.default(tradeMiningRedeem.bananaPrice).multipliedBy(tradeMiningRedeem.bananaBalance).toFixed();
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
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TradeMiningV2Service.prototype, "claim", null);
TradeMiningV2Service = __decorate([
    (0, tool_1.CacheKey)('TradeMiningV2Service'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], TradeMiningV2Service);
exports.TradeMiningV2Service = TradeMiningV2Service;
