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
exports.TradeMiningApi = void 0;
const BaseApi_1 = require("./BaseApi");
const tool_1 = require("../tool");
const lodash_1 = __importDefault(require("lodash"));
const gql_1 = require("./gql");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const vo_1 = require("../vo");
/**
 * Bond API
 */
let TradeMiningApi = class TradeMiningApi {
    constructor(baseApi) {
        this.baseApi = baseApi;
    }
    async getBananaRate() {
        const { bananaApexRateLogs } = await this.baseApi.bananaGraph((0, gql_1.getBananaApexRateLogs)(), {});
        return {
            rate: lodash_1.default.get(bananaApexRateLogs, '[0].rate', '0'),
            bananaPrice: lodash_1.default.get(bananaApexRateLogs, '[0].bananaPrice', '0'),
        };
    }
    async getSwapInfo() {
        const { bananaApexRateLogs, usdcTotalSpents, klineLogs, transferLogs } = await this.baseApi.bananaGraph((0, gql_1.getSwapInfo)(), {
            to: this.baseApi.connectInfo().addressInfo.buybackPool.toLowerCase(),
        });
        return {
            rate: lodash_1.default.get(bananaApexRateLogs, '[0].rate', '0'),
            bananaPrice: lodash_1.default.get(bananaApexRateLogs, '[0].bananaPrice', '0'),
            totalSpents: lodash_1.default.get(usdcTotalSpents, '[0].amount', '0'),
            boostUpRates: new bignumber_js_1.default(lodash_1.default.get(transferLogs, '[0].amount', '0')).div(60 * 60 * 24 * 7).toFixed(),
            kline: Array.from(klineLogs)
                .reverse()
                .map((k) => {
                const it = k;
                const kline = new vo_1.Kline();
                kline.open = it.open;
                kline.close = it.close;
                kline.high = it.high;
                kline.low = it.low;
                kline.timestamp = it.timestamp;
                return kline;
            }),
        };
    }
    async getActionsHistory(user) {
        const { userActionTotalGains, bananaUserActionsLogs } = await this.baseApi.bananaGraph((0, gql_1.getActionsHistory)(), {
            user,
        });
        const tradeMiningTotalGains = new vo_1.TradeMiningTotalGains();
        tradeMiningTotalGains.totalClaimed = lodash_1.default.get(userActionTotalGains, '[0].banana', '0');
        tradeMiningTotalGains.totalSwaped = lodash_1.default.get(userActionTotalGains, '[0].usdc', '0');
        tradeMiningTotalGains.totalRedeemed = lodash_1.default.get(userActionTotalGains, '[0].apex', '0');
        return {
            totalGains: tradeMiningTotalGains,
            history: Array.from(bananaUserActionsLogs)
                .reverse()
                .map((data) => {
                const it = data;
                const history = new vo_1.TradeMiningActionsHistory();
                history.action = it.action;
                history.apex = it.apex;
                history.banana = it.banana;
                history.usdc = it.usdc;
                history.timestamp = it.timestamp;
                history.hash = it.hash;
                history.hashLink = this.baseApi.connectInfo().addressInfo.getEtherscanTx(it.hash);
                return history;
            }),
        };
    }
};
TradeMiningApi = __decorate([
    (0, tool_1.CacheKey)('TradeMiningApi'),
    __metadata("design:paramtypes", [BaseApi_1.BaseApi])
], TradeMiningApi);
exports.TradeMiningApi = TradeMiningApi;
