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
            price: new bignumber_js_1.default((0, tool_1.getValue)(apexPriceResult, 'result.price', '0')).toFixed(),
        };
    }
    async apexPoolAPY() {
        const [apexPrice, apiStakeInfo] = await Promise.all([
            this.apexPrice(),
            this.baseApi.apiBaseRequest(`/api/v1/staking/staking-user-data`, 'get', {}),
        ]);
        const apy = ApexPoolMathTool_1.ApexPoolMathTool.APY((0, tool_1.getValue)(apiStakeInfo, 'lastWeekTotalStakingReward', '0'), (0, tool_1.getValue)(apiStakeInfo, 'lastWeekTotalStake', '0'), apexPrice.price, new bignumber_js_1.default((0, tool_1.getValue)(apiStakeInfo, 'apexStakingApyFactor.totalAvgStakeTime', '0')).div(86400).toFixed()).apy;
        return {
            apy,
        };
    }
    async apexPoolStakeInfo(address, privateApi) {
        const [mainnetApexPoolStakeInfos, arbiApexPoolStakeInfos, stakingUserDataResp] = await Promise.all([
            this.baseApi.bananaGraph((0, api_1.getApexPoolStakeInfos)(), {}),
            this.baseApi.arbiBananaGraph((0, api_1.getApexPoolStakeInfos)(), {}),
            privateApi.get(`/api/v1/staking/staking-user-data`, {}),
        ]);
        // goerli or mainnet 质押数据
        const mainnetTotalApexStake = (0, tool_1.getValue)(mainnetApexPoolStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const mainnetTotalEsApexStake = (0, tool_1.getValue)(mainnetApexPoolStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        // goerli-arbi or arbi 质押数据
        const arbiTotalApexStake = (0, tool_1.getValue)(arbiApexPoolStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const arbiTotalEsApexStake = (0, tool_1.getValue)(arbiApexPoolStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        const totalApexStake = new bignumber_js_1.default(mainnetTotalApexStake).plus(arbiTotalApexStake).toFixed();
        const totalEsApexStake = new bignumber_js_1.default(mainnetTotalEsApexStake).plus(arbiTotalEsApexStake).toFixed();
        const stakingUserData = (0, tool_1.getValue)(stakingUserDataResp, 'data.data', {});
        const esApexStake = {
            lastTotalStakeAmount: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.lastTotalStakeAmount', '0'),
            t2eFactor: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.t2eFactor', '0'),
            lastUserStakeAmount: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.lastUserStakeAmount', '0'),
            timeFactor: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.timeFactor', '0'),
            avgStakeTime: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.avgStakeTime', '0'),
            totalAvgStakeTime: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.totalAvgStakeTime', '0'),
            totalFactor: '0',
        };
        esApexStake.totalFactor = ApexPoolMathTool_1.ApexPoolMathTool.totalFactor(esApexStake.t2eFactor, esApexStake.timeFactor).totalFactor;
        const apexStake = {
            lastTotalStakeAmount: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.lastTotalStakeAmount', '0'),
            t2eFactor: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.t2eFactor', '0'),
            lastUserStakeAmount: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.lastUserStakeAmount', '0'),
            timeFactor: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.timeFactor', '0'),
            avgStakeTime: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.avgStakeTime', '0'),
            totalAvgStakeTime: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.totalAvgStakeTime', '0'),
            totalFactor: '0',
        };
        apexStake.totalFactor = ApexPoolMathTool_1.ApexPoolMathTool.totalFactor(apexStake.t2eFactor, apexStake.timeFactor).totalFactor;
        const appId = (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.appId', (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.appId', '') || '');
        const rewardList = (0, tool_1.getValue)(stakingUserData, 'rewardList', [])
            .map((item) => {
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
                canClaim: item.status === 'NOT_RECEIVED',
            };
        })
            .filter((item) => item !== null);
        const lastWeekUserReward = (0, tool_1.isNullOrBlank)(stakingUserData.lastWeekUserReward)
            ? '0'
            : stakingUserData.lastWeekUserReward;
        const lastWeekTotalStakingReward = (0, tool_1.getValue)(stakingUserData, 'lastWeekTotalStakingReward', '0');
        const lastWeekTotalStake = (0, tool_1.getValue)(stakingUserData, 'lastWeekTotalStake', '0');
        const stakingHoldingsList = (0, tool_1.getValue)(stakingUserData, 'stakingHoldings', []);
        const round = (0, tool_1.getValue)(stakingUserData, 'currentRound', 0);
        const avgStakeTime = ApexPoolMathTool_1.ApexPoolMathTool.avgStakeTime(apexStake, esApexStake).avgStakeTime;
        const totalAvgStakeTime = esApexStake.totalAvgStakeTime;
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
            stakingHoldingsList,
            avgStakeTime,
            totalAvgStakeTime,
        };
    }
};
RequestService = __decorate([
    (0, tool_1.CacheKey)('RequestService'),
    __metadata("design:paramtypes", [])
], RequestService);
exports.RequestService = RequestService;
