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
const ApexPoolMathTool_1 = require("./tool/ApexPoolMathTool");
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
        `https://api.apex.exchange/v1/data/apex-price`, "get", {});
        return {
            price: new bignumber_js_1.default(lodash_1.default.get(apexPriceResult, "result.price", "0")).toFixed()
        };
    }
    async apexPoolAPY() {
        const [apexPrice, apiStakeInfo] = await Promise.all([
            this.apexPrice(),
            this.baseApi.apiBaseRequest(`/api/v1/staking/staking-user-data`, "get", {})
        ]);
        const apy = ApexPoolMathTool_1.ApexPoolMathTool.APY(lodash_1.default.get(apiStakeInfo, "lastWeekTotalStakingReward", "0"), lodash_1.default.get(apiStakeInfo, "lastWeekTotalStake", "0"), apexPrice.price).apy;
        return {
            apy
        };
    }
    async apexPoolStakeInfo(address, privateApi) {
        const [{ apexPoolStakeInfos }, stakingUserDataResp] = await Promise.all([
            this.baseApi.bananaGraph((0, api_1.getApexPoolStakeInfos)(), {}),
            privateApi.get(`/api/v1/staking/staking-user-data`, {})
        ]);
        const stakingUserData = lodash_1.default.get(stakingUserDataResp, 'data.data', {});
        const totalApexStake = lodash_1.default.get(apexPoolStakeInfos, "[0].apex", "0");
        const totalEsApexStake = lodash_1.default.get(apexPoolStakeInfos, "[0].esApex", "0");
        const esApexStake = {
            lastTotalStakeAmount: lodash_1.default.get(stakingUserData, "esApexStakingApyFactor.lastTotalStakeAmount", "0"),
            t2eFactor: lodash_1.default.get(stakingUserData, "esApexStakingApyFactor.t2eFactor", "0"),
            timeFactor: lodash_1.default.get(stakingUserData, "esApexStakingApyFactor.timeFactor", "0"),
            totalFactor: "0"
        };
        esApexStake.totalFactor = ApexPoolMathTool_1.ApexPoolMathTool.totalFactor(esApexStake.t2eFactor, esApexStake.timeFactor).totalFactor;
        const apexStake = {
            lastTotalStakeAmount: lodash_1.default.get(stakingUserData, "apexStakingApyFactor.lastTotalStakeAmount", "0"),
            t2eFactor: lodash_1.default.get(stakingUserData, "apexStakingApyFactor.t2eFactor", "0"),
            timeFactor: lodash_1.default.get(stakingUserData, "apexStakingApyFactor.timeFactor", "0"),
            totalFactor: "0"
        };
        apexStake.totalFactor = ApexPoolMathTool_1.ApexPoolMathTool.totalFactor(apexStake.t2eFactor, apexStake.timeFactor).totalFactor;
        const appId = lodash_1.default.get(stakingUserData, "apexStakingApyFactor.appId") || lodash_1.default.get(stakingUserData, "esApexStakingApyFactor.appId") || "";
        const rewardList = lodash_1.default.get(stakingUserData, "rewardList", []).map((item) => {
            if (!item.amount) {
                return null;
            }
            return {
                appId,
                roundId: parseInt(item.round, 10),
                rewardId: item.rewardId,
                amount: item.amount,
                token: item.symbol,
                time: item.createdTime,
                canClaim: item.status === "NOT_RECEIVED"
            };
        }).filter((item) => item !== null);
        const lastWeekUserReward = (0, tool_1.isNullOrBlank)(stakingUserData.lastWeekUserReward) ? "0" : stakingUserData.lastWeekUserReward;
        const lastWeekTotalStakingReward = lodash_1.default.get(stakingUserData, "lastWeekTotalStakingReward", "0");
        const lastWeekTotalStake = lodash_1.default.get(stakingUserData, "lastWeekTotalStake", "0");
        const stakingHoldingsList = lodash_1.default.get(stakingUserData, "stakingHoldings", []);
        const round = lodash_1.default.get(stakingUserData, "currentRound", 0);
        return {
            totalApexStake,
            totalEsApexStake,
            round,
            rewardList,
            lastWeekTotalStakingReward,
            lastWeekUserReward,
            lastWeekTotalStake,
            apexStake,
            esApexStake,
            stakingHoldingsList
        };
    }
};
RequestService = __decorate([
    (0, tool_1.CacheKey)("RequestService"),
    __metadata("design:paramtypes", [])
], RequestService);
exports.RequestService = RequestService;
