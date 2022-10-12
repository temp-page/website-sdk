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
const IBuybackPool_1 = require("../abi/IBuybackPool");
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
    async getBuyingRate() {
        const value = await this.baseApi.connectInfo().create(IBuybackPool_1.IBuybackPool).lastBuyingRate();
        return new bignumber_js_1.default(value).div(10 ** 6).toFixed();
    }
    async getSwapInfo() {
        const { bananaApexRateLogs, usdcTotalSpents, klineLogs, bananaBurns } = await this.baseApi.bananaGraph((0, gql_1.getSwapInfo)(), {});
        return {
            rate: lodash_1.default.get(bananaApexRateLogs, '[0].rate', '0'),
            bananaPrice: lodash_1.default.get(bananaApexRateLogs, '[0].bananaPrice', '0'),
            totalSpents: lodash_1.default.get(usdcTotalSpents, '[0].amount', '0'),
            boostUpRates: await this.getBuyingRate(),
            bananaBurns: lodash_1.default.get(bananaBurns, '[0].amount', '0'),
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
            history: Array.from(bananaUserActionsLogs).map((data) => {
                const it = data;
                const history = new vo_1.TradeMiningActionsHistory();
                history.action = it.action;
                history.apex = it.apex;
                history.banana = it.banana;
                history.usdc = it.usdc;
                history.timestamp = it.timestamp;
                history.hash = it.hash;
                history.hashLink = this.baseApi.address().getEtherscanTx(it.hash);
                return history;
            }),
        };
    }
    async getBBP(user) {
        const bbpData = await this.baseApi.bananaGraph((0, gql_1.getBBPData)(), {
            user,
        });
        const tradeMiningBBP = new vo_1.TradeMiningBBP();
        const { bananaBalances, usdcTotalSpents, bananaApexRateLogs, buybackPoolLogs } = bbpData;
        const bbpbuyAndRedeemRateLogs = Object.keys(bbpData)
            .filter((key) => key.indexOf('bbpPage') >= 0)
            .flatMap((key) => bbpData[key]);
        tradeMiningBBP.bananaBalance = lodash_1.default.get(bananaBalances, '[0].balance', '0');
        tradeMiningBBP.totalSpent = lodash_1.default.get(usdcTotalSpents, '[0].amount', '0');
        tradeMiningBBP.currentRedeemPrice = lodash_1.default.get(bananaApexRateLogs, '[0].rate', '0');
        tradeMiningBBP.currentPrice = lodash_1.default.get(bananaApexRateLogs, '[0].bananaPrice', '0');
        tradeMiningBBP.currentRate = await this.getBuyingRate();
        tradeMiningBBP.dataTable = bbpbuyAndRedeemRateLogs
            .map((it) => {
            return {
                burnVol: it.bananaBurn,
                redeemRate: it.redeem,
                time: it.timestamp,
            };
        })
            .sort((a, b) => new bignumber_js_1.default(a.time).comparedTo(b.time)); // 时间升序
        tradeMiningBBP.allDataTable = Array.from(tradeMiningBBP.dataTable);
        // 最新的 24小时
        tradeMiningBBP.dayDataTable = Array.from(tradeMiningBBP.dataTable).reverse().slice(0, 24).reverse();
        // 最新的 24小时 * 7 天的
        tradeMiningBBP.weekDataTable = Array.from(tradeMiningBBP.dataTable)
            .reverse()
            .slice(0, 24 * 7)
            .reverse();
        // 最新的 24小时 * 30 天的
        tradeMiningBBP.monthDataTable = Array.from(tradeMiningBBP.dataTable)
            .reverse()
            .slice(0, 24 * 30)
            .reverse();
        tradeMiningBBP.records = buybackPoolLogs
            .map((it) => {
            return {
                amount: it.amountIn,
                bootUp: it.buyingRate,
                burn: it.burned,
                time: it.timestamp,
                tx: it.hash,
                txLink: this.baseApi.address().getEtherscanTx(it.hash),
            };
        })
            .reverse();
        return tradeMiningBBP;
    }
};
TradeMiningApi = __decorate([
    (0, tool_1.CacheKey)('TradeMiningApi'),
    __metadata("design:paramtypes", [BaseApi_1.BaseApi])
], TradeMiningApi);
exports.TradeMiningApi = TradeMiningApi;
