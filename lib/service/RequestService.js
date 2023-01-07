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
exports.RequestService = void 0;
const lodash_1 = __importDefault(require("lodash"));
const tool_1 = require("./tool");
const api_1 = require("./api");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
/**
 * 请求基类 详细信息查看
 */
let RequestService = class RequestService {
    constructor() {
        this.baseApi = api_1.BASE_API;
    }
    tradeMiningApi() {
        return new api_1.TradeMiningApi();
    }
    async apexPrice() {
        const apexPriceResult = await this.baseApi.request(
        // bybit api 写死
        `https://api.apex.exchange/v1/data/apex-price`, 'get', {});
        return {
            price: new bignumber_js_1.default(lodash_1.default.get(apexPriceResult, 'result.price', '0')).toFixed(),
        };
    }
    async apexPoolStakeInfo(accountId) {
        const { apexPoolStakeInfos } = await this.baseApi.bananaGraph((0, api_1.getApexPoolStakeInfos)(), {});
        const totalApexStake = lodash_1.default.get(apexPoolStakeInfos, '[0].apex', '0');
        const totalEsApexStake = lodash_1.default.get(apexPoolStakeInfos, '[0].esApex', '0');
        // TODO not impl 接口实现部分
        // 获取用户最新的质押因子
        // 时间因子和t2e因子
        const lastWeekTotalStakingReward = '0';
        const lastWeekTotalStake = '0';
        const t2eFactor = '0';
        const timeFactor = '0';
        const totalFactor = new bignumber_js_1.default('1').plus(t2eFactor).plus(t2eFactor).toFixed();
        const rewardList = [
            {
                amount: '10',
                token: 'USDC',
                time: new Date().getTime(),
                canClaim: false,
            },
        ];
        // 时间倒叙，获取最后一条奖励记录
        const lastWeekUserReward = lodash_1.default.get(Array.from(rewardList).sort((a, b) => new bignumber_js_1.default(b.time).comparedTo(a.time)), '[0].amount', '0');
        return {
            totalApexStake,
            totalEsApexStake,
            lastWeekTotalStakingReward,
            lastWeekUserReward,
            lastWeekTotalStake,
            rewardList,
            t2eFactor,
            timeFactor,
            totalFactor,
        };
    }
};
RequestService = __decorate([
    (0, tool_1.CacheKey)('RequestService'),
    __metadata("design:paramtypes", [])
], RequestService);
exports.RequestService = RequestService;
