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
        `https://api.apex.exchange/v1/data/apex-price`, 'get', {});
        return {
            price: new bignumber_js_1.default(lodash_1.default.get(apexPriceResult, 'result.price', '0')).toFixed(),
        };
    }
    async apexPoolStakeInfo(address, privateApi) {
        const round = parseInt(lodash_1.default.get(await privateApi.get(`/api/v1/staking/current-staking-round`, {}), 'data.data', '0'), 10);
        const [{ apexPoolStakeInfos }, stakingTotalRewardResp, apexStakingApyFactorResp, esApexStakingApyFactorResp, finishedStakingRoundResp, stakingHoldingsListResp,] = await Promise.all([
            this.baseApi.bananaGraph((0, api_1.getApexPoolStakeInfos)(), {}),
            round <= 1 ? Promise.resolve() : privateApi.get(`/api/v1/staking/staking-total-reward?round=${round - 1}`, {}),
            privateApi.get(`/api/v1/staking/staking-apy-factor?stakeToken=apex`, {}),
            privateApi.get(`/api/v1/staking/staking-apy-factor?stakeToken=esApex`, {}),
            privateApi.get(`/api/v1/staking/finished-staking-round`, {}),
            privateApi.get(`/api/v1/staking/staking-holdings?round=${round}`, {}),
        ]);
        let rewardList = [];
        const appId = lodash_1.default.get(apexStakingApyFactorResp, 'data.data.appId', '');
        const finishedStakingRoundList = lodash_1.default.get(finishedStakingRoundResp, 'data.data', []);
        if (finishedStakingRoundList.length > 0) {
            const rewardIds = Array.from(finishedStakingRoundList).map((item) => item.rewardId).join(",");
            const accountRewardByIdResp = await privateApi.get(`/api/v1/account-reward-by-id?rewardIds=${rewardIds}&appId=${appId}`, {});
            const accountRewardList = Array.from(lodash_1.default.get(accountRewardByIdResp, 'data.data.rewardList', []));
            rewardList = finishedStakingRoundList.map((item) => {
                const accountReward = accountRewardList.find((it) => it.rewardId === item.rewardId);
                if (!accountReward || !accountReward.amount) {
                    return null;
                }
                return {
                    appId,
                    roundId: parseInt(item.round, 10),
                    rewardId: accountReward.rewardId,
                    amount: accountReward.amount,
                    token: accountReward.symbol,
                    time: accountReward.createdTime,
                    canClaim: accountReward.status === 'NOT_RECEIVED',
                };
            }).filter((item) => item !== null);
        }
        const apexStake = {
            lastTotalStakeAmount: lodash_1.default.get(apexStakingApyFactorResp, 'data.data.lastTotalStakeAmount', '0'),
            t2eFactor: lodash_1.default.get(apexStakingApyFactorResp, 'data.data.t2eFactor', '0'),
            timeFactor: lodash_1.default.get(apexStakingApyFactorResp, 'data.data.timeFactor', '0'),
            totalFactor: '0',
        };
        apexStake.totalFactor = ApexPoolMathTool_1.ApexPoolMathTool.totalFactor(apexStake.t2eFactor, apexStake.timeFactor).totalFactor;
        const esApexStake = {
            lastTotalStakeAmount: lodash_1.default.get(esApexStakingApyFactorResp, 'data.data.lastTotalStakeAmount', '0'),
            t2eFactor: lodash_1.default.get(esApexStakingApyFactorResp, 'data.data.t2eFactor', '0'),
            timeFactor: lodash_1.default.get(esApexStakingApyFactorResp, 'data.data.timeFactor', '0'),
            totalFactor: '0',
        };
        esApexStake.totalFactor = ApexPoolMathTool_1.ApexPoolMathTool.totalFactor(esApexStake.t2eFactor, esApexStake.timeFactor).totalFactor;
        const lastWeekTotalStakingReward = lodash_1.default.get(stakingTotalRewardResp, 'data.data.totalStakingReward', '0');
        const lastWeekTotalStake = new bignumber_js_1.default(apexStake.lastTotalStakeAmount)
            .plus(esApexStake.lastTotalStakeAmount)
            .toFixed();
        const totalApexStake = lodash_1.default.get(apexPoolStakeInfos, '[0].apex', '0');
        const totalEsApexStake = lodash_1.default.get(apexPoolStakeInfos, '[0].esApex', '0');
        // 时间倒叙，获取最后一条奖励记录
        const lastWeekUserReward = lodash_1.default.get(Array.from(rewardList).find(it => round - 1 === it.roundId), 'amount', '0');
        const stakingHoldingsList = lodash_1.default.get(stakingHoldingsListResp, 'data.data', []);
        return {
            round,
            totalApexStake,
            totalEsApexStake,
            lastWeekTotalStakingReward,
            lastWeekUserReward,
            lastWeekTotalStake,
            rewardList,
            apexStake,
            esApexStake,
            stakingHoldingsList
        };
    }
};
RequestService = __decorate([
    (0, tool_1.CacheKey)('RequestService'),
    __metadata("design:paramtypes", [])
], RequestService);
exports.RequestService = RequestService;
