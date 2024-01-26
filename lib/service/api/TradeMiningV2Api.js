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
exports.TradeMiningV2Api = void 0;
const BaseApi_1 = require("./BaseApi");
const tool_1 = require("../tool");
const lodash_1 = __importDefault(require("lodash"));
const gql_1 = require("./gql");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const vo_1 = require("../vo");
const abi_1 = require("../abi");
const actionTypes = [
    "claim",
    "buy",
    "sell",
    "out",
    "in",
    "redeem",
    "addLp",
    "removeLp",
];
/**
 * Bond API
 */
let TradeMiningV2Api = class TradeMiningV2Api {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    async getBananaPrice() {
        const connectInfo = this.baseApi.connectInfo();
        const iBananaUsdtPair = connectInfo.create(abi_1.IBananaUsdtPair);
        const banana = connectInfo.create(abi_1.ERC20, connectInfo.addressInfo.bananaV2);
        const usdt = connectInfo.create(abi_1.ERC20, connectInfo.addressInfo.usdt);
        const [result, bananaResult, usdtResult] = await connectInfo.multiCall().call({
            getReserves: iBananaUsdtPair.pairInstance.getReserves(),
            token0: iBananaUsdtPair.pairInstance.token0(),
        }, {
            decimals: banana.erc20Instance.decimals(),
        }, {
            decimals: usdt.erc20Instance.decimals(),
        });
        const token0 = result.token0;
        const reserves = [result.getReserves._reserve0, result.getReserves._reserve1];
        let price = "0";
        if (new bignumber_js_1.default(reserves[0]).comparedTo("0") <= 0 || new bignumber_js_1.default(reserves[1]).comparedTo("0") <= 0) {
            return {
                price,
            };
        }
        if ((0, tool_1.eqAddress)(token0, connectInfo.addressInfo.bananaV2)) {
            price = new bignumber_js_1.default(reserves[1]).div(10 ** usdtResult.decimals).div(new bignumber_js_1.default(reserves[0]).div(10 ** bananaResult.decimals)).toFixed();
        }
        else {
            price = new bignumber_js_1.default(reserves[0]).div(10 ** usdtResult.decimals).div(new bignumber_js_1.default(reserves[1]).div(10 ** bananaResult.decimals)).toFixed();
        }
        return {
            price,
        };
    }
    async getActionsHistory(user, actions = actionTypes) {
        const { historyTotals, bananaUserActionsLogs } = await this.baseApi.bananaV2Graph((0, gql_1.getActionsV2History)(), {
            user,
            actions
        });
        const tradeMiningTotalGains = new vo_1.TradeMiningTotalGains();
        tradeMiningTotalGains.totalClaimed = lodash_1.default.get(historyTotals, "[0].banana", "0");
        tradeMiningTotalGains.totalSwaped = lodash_1.default.get(historyTotals, "[0].usdt", "0");
        tradeMiningTotalGains.totalRedeemed = lodash_1.default.get(historyTotals, "[0].apex", "0");
        return {
            totalGains: tradeMiningTotalGains,
            history: Array.from(bananaUserActionsLogs).map((data) => {
                const it = data;
                const history = new vo_1.TradeMiningV2ActionsHistory();
                history.action = it.action;
                history.apex = it.apex;
                history.banana = it.banana;
                history.lpToken = it.lpToken;
                history.usdt = it.usdt;
                history.timestamp = it.timestamp;
                history.hash = it.hash;
                history.hashLink = this.baseApi.address().getEtherscanTx(it.hash);
                if (history.action === 'buy' || history.action === 'sell') {
                    history.rate = new bignumber_js_1.default(history.usdt).div(history.banana).toFixed();
                }
                return history;
            })
        };
    }
    async burnRecord() {
        const bananaBurnFrom = this.baseApi.address().bananaBurnFrom;
        const { transferLogs } = await this.baseApi.bananaV2Graph((0, gql_1.getBananaBurnRecord)(bananaBurnFrom), {});
        return Array.from(transferLogs).map((it) => {
            return {
                burn: it.amount,
                time: it.timestamp,
                hash: it.hash,
                txLink: this.baseApi.address().getEtherscanTx(it.hash),
            };
        });
    }
};
__decorate([
    (0, tool_1.MethodCache)("TradeMiningV2Api.getBananaPrice", 30 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradeMiningV2Api.prototype, "getBananaPrice", null);
TradeMiningV2Api = __decorate([
    (0, tool_1.CacheKey)("TradeMiningV2Api"),
    __metadata("design:paramtypes", [])
], TradeMiningV2Api);
exports.TradeMiningV2Api = TradeMiningV2Api;
