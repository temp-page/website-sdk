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
const TwammTool_1 = require("./TwammTool");
const actionTypes = [
    "claim",
    "buy",
    "sell",
    "out",
    "in",
    "redeem",
    "addLp",
    "removeLp",
    "staking",
    "unstaking",
    "claimStakingReward",
    "stakeApex",
    "unstakeApex",
    "stakeEsApex",
    "unstakeEsApex"
];
/**
 * Bond API
 */
let TradeMiningApi = class TradeMiningApi {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    async getBananaPrice() {
        try {
            const executeVirtualOrdersResult = await (0, TwammTool_1.executeVirtualOrders)(this.baseApi.connectInfo());
            let bananaReserves = executeVirtualOrdersResult.reserveA;
            let usdcReserves = executeVirtualOrdersResult.reserveB;
            if ((0, tool_1.eqAddress)(this.baseApi.connectInfo().addressInfo.banana, executeVirtualOrdersResult.tokenB)) {
                bananaReserves = executeVirtualOrdersResult.reserveB;
                usdcReserves = executeVirtualOrdersResult.reserveA;
            }
            const price = new bignumber_js_1.default(usdcReserves).div(1e6).div(new bignumber_js_1.default(bananaReserves).div(1e18)).toFixed();
            return {
                price
            };
        }
        catch (e) {
            tool_1.Trace.error(e);
            return {
                price: "0"
            };
        }
    }
    async executeVirtualOrders() {
        return await (0, TwammTool_1.executeVirtualOrders)(this.baseApi.connectInfo());
    }
    async getBananaRate() {
        const { bananaApexRateLogs } = await this.baseApi.bananaGraph((0, gql_1.getBananaApexRateLogs)(), {});
        return {
            rate: lodash_1.default.get(bananaApexRateLogs, "[0].rate", "0"),
            bananaPrice: (await this.getBananaPrice()).price
        };
    }
    async getBuyingRate() {
        const value = await this.baseApi.connectInfo().create(IBuybackPool_1.IBuybackPool).lastBuyingRate();
        return new bignumber_js_1.default(value).div(10 ** 6).toFixed();
    }
    async getSwapInfo() {
        const { bananaApexRateLogs, usdcTotalSpents, bananaBurns } = await this.baseApi.bananaGraph((0, gql_1.getSwapInfo)(), {});
        return {
            rate: lodash_1.default.get(bananaApexRateLogs, "[0].rate", "0"),
            bananaPrice: (await this.getBananaPrice()).price,
            totalSpents: lodash_1.default.get(usdcTotalSpents, "[0].amount", "0"),
            boostUpRates: await this.getBuyingRate(),
            bananaBurns: lodash_1.default.get(bananaBurns, "[0].amount", "0")
        };
    }
    async getActionsHistory(user, actions = actionTypes) {
        const { userActionTotalGains, bananaUserActionsLogs } = await this.baseApi.bananaGraph((0, gql_1.getActionsHistory)(), {
            user,
            actions
        });
        const tradeMiningTotalGains = new vo_1.TradeMiningTotalGains();
        tradeMiningTotalGains.totalClaimed = lodash_1.default.get(userActionTotalGains, "[0].banana", "0");
        tradeMiningTotalGains.totalSwaped = lodash_1.default.get(userActionTotalGains, "[0].usdc", "0");
        tradeMiningTotalGains.totalRedeemed = lodash_1.default.get(userActionTotalGains, "[0].apex", "0");
        return {
            totalGains: tradeMiningTotalGains,
            history: Array.from(bananaUserActionsLogs).map((data) => {
                const it = data;
                const history = new vo_1.TradeMiningActionsHistory();
                history.action = it.action;
                history.apex = it.apex;
                history.esApex = it.esApex;
                history.banana = it.banana;
                history.lpToken = it.lpToken;
                history.usdc = it.usdc;
                history.timestamp = it.timestamp;
                history.hash = it.hash;
                history.hashLink = this.baseApi.address().getEtherscanTx(it.hash);
                if (history.action === "staking") {
                    history.expireAt = it.expandParams;
                    history.locking = false;
                    if (history.expireAt !== "0" && +history.expireAt > new Date().getTime() / 1000) {
                        history.locking = true;
                    }
                }
                return history;
            })
        };
    }
    async getBBP(user) {
        const bbpData = await this.baseApi.bananaGraph((0, gql_1.getBBPData)(), {
            user
        });
        const tradeMiningBBP = new vo_1.TradeMiningBBP();
        const { bananaBalances, usdcTotalSpents, bananaApexRateLogs, buybackPoolLogs } = bbpData;
        const bbpbuyAndRedeemRateLogs = Object.keys(bbpData)
            .filter((key) => key.indexOf("bbpPage") >= 0)
            .flatMap((key) => bbpData[key]);
        tradeMiningBBP.bananaBalance = lodash_1.default.get(bananaBalances, "[0].balance", "0");
        tradeMiningBBP.totalSpent = lodash_1.default.get(usdcTotalSpents, "[0].amount", "0");
        tradeMiningBBP.currentRedeemPrice = lodash_1.default.get(bananaApexRateLogs, "[0].rate", "0");
        tradeMiningBBP.currentPrice = (await this.getBananaPrice()).price;
        tradeMiningBBP.currentRate = await this.getBuyingRate();
        tradeMiningBBP.dataTable = bbpbuyAndRedeemRateLogs
            .map((it) => {
            return {
                burnVol: it.bananaBurn,
                redeemRate: it.redeem,
                time: it.timestamp
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
                txLink: this.baseApi.address().getEtherscanTx(it.hash)
            };
        })
            .reverse();
        return tradeMiningBBP;
    }
    async getRedeemRate() {
        const { bananaApexRateLogs } = await this.baseApi.bananaGraph((0, gql_1.getRedeemRate)(), {});
        return Array.from(bananaApexRateLogs).reverse();
    }
};
__decorate([
    (0, tool_1.MethodCache)("TradeMiningApi.getBananaPrice", 30 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradeMiningApi.prototype, "getBananaPrice", null);
__decorate([
    (0, tool_1.MethodCache)("TradeMiningApi.executeVirtualOrders", 10 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradeMiningApi.prototype, "executeVirtualOrders", null);
__decorate([
    (0, tool_1.MethodCache)("TradeMiningApi.getBananaRate", 30 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradeMiningApi.prototype, "getBananaRate", null);
__decorate([
    (0, tool_1.MethodCache)("TradeMiningApi.getBuyingRate", 30 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradeMiningApi.prototype, "getBuyingRate", null);
__decorate([
    (0, tool_1.MethodCache)("TradeMiningApi.getSwapInfo", 30 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TradeMiningApi.prototype, "getSwapInfo", null);
__decorate([
    (0, tool_1.MethodCache)("TradeMiningApi.getBBP", 30 * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TradeMiningApi.prototype, "getBBP", null);
TradeMiningApi = __decorate([
    (0, tool_1.CacheKey)("TradeMiningApi"),
    __metadata("design:paramtypes", [])
], TradeMiningApi);
exports.TradeMiningApi = TradeMiningApi;
