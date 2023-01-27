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
        const apy = ApexPoolMathTool_1.ApexPoolMathTool.APY((0, tool_1.getValue)(apiStakeInfo, 'lastWeekTotalStakingReward', '0'), (0, tool_1.getValue)(apiStakeInfo, 'lastWeekTotalStake', '0'), apexPrice.price).apy;
        return {
            apy,
        };
    }
    async apexPoolStakeInfo(address, privateApi) {
        // tslint:disable-next-line:prefer-const
        let [{ apexPoolStakeInfos }, stakingUserDataResp] = await Promise.all([
            this.baseApi.bananaGraph((0, api_1.getApexPoolStakeInfos)(), {}),
            privateApi.get(`/api/v1/staking/staking-user-data`, {}),
        ]);
        stakingUserDataResp = {
            data: {
                "data": {
                    "currentRound": 100,
                    "lastWeekTotalStakingReward": "6.867791",
                    "stakingHoldings": [{
                            "round": 100,
                            "stakeId": "899",
                            "stakeToken": "esApex",
                            "stakeAmount": "120",
                            "totalFactor": "1.2228310502283056",
                            "t2eFactor": "0",
                            "timeFactor": "0.2228310502283056",
                            "stakeDuration": "669397",
                            "updateTime": 1673769468
                        }],
                    "apexStakingApyFactor": {
                        "t2eFactor": "0",
                        "timeFactor": "0",
                        "lastTotalStakeAmount": "11420.34186525",
                        "appId": "trade-to-mine",
                        "lastUserStakeAmount": "0",
                        "avgStakeTime": "0"
                    },
                    "esApexStakingApyFactor": {
                        "t2eFactor": "0",
                        "timeFactor": "0",
                        "lastTotalStakeAmount": "620",
                        "appId": "trade-to-mine",
                        "lastUserStakeAmount": "120",
                        "avgStakeTime": "3600"
                    },
                    "lastWeekTotalStake": "12040.34186525",
                    "rewardList": [{
                            "rewardId": "2023011713",
                            "symbol": "USDC",
                            "amount": "5.34219",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673965800000,
                            "rewardEndTime": 1989325800000,
                            "createdTime": 1673965801000,
                            "updatedTime": 1673965801000
                        }, {
                            "rewardId": "202301178",
                            "symbol": "USDC",
                            "amount": "91.268933",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673947800000,
                            "rewardEndTime": 1989307800000,
                            "createdTime": 1673947800000,
                            "updatedTime": 1673947800000
                        }, {
                            "rewardId": "202301173",
                            "symbol": "USDC",
                            "amount": "0.635508",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673929800000,
                            "rewardEndTime": 1989289800000,
                            "createdTime": 1673929800000,
                            "updatedTime": 1673929800000
                        }, {
                            "rewardId": "202301172",
                            "symbol": "USDC",
                            "amount": "0.504722",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673926200000,
                            "rewardEndTime": 1989286200000,
                            "createdTime": 1673926200000,
                            "updatedTime": 1673926200000
                        }, {
                            "rewardId": "202301171",
                            "symbol": "USDC",
                            "amount": "0.205013",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673922600000,
                            "rewardEndTime": 1989282600000,
                            "createdTime": 1673922600000,
                            "updatedTime": 1673922600000
                        }, {
                            "rewardId": "2023011619",
                            "symbol": "USDC",
                            "amount": "0.078828",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673901000000,
                            "rewardEndTime": 1989261000000,
                            "createdTime": 1673901000000,
                            "updatedTime": 1673901000000
                        }, {
                            "rewardId": "2023011616",
                            "symbol": "USDC",
                            "amount": "0.359535",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673890200000,
                            "rewardEndTime": 1989250200000,
                            "createdTime": 1673890200000,
                            "updatedTime": 1673890200000
                        }, {
                            "rewardId": "2023011614",
                            "symbol": "USDC",
                            "amount": "0.037342",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673883000000,
                            "rewardEndTime": 1989243000000,
                            "createdTime": 1673883000000,
                            "updatedTime": 1673883000000
                        }, {
                            "rewardId": "2023011612",
                            "symbol": "USDC",
                            "amount": "2.781026",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673875800000,
                            "rewardEndTime": 1989235800000,
                            "createdTime": 1673875800000,
                            "updatedTime": 1673875800000
                        }, {
                            "rewardId": "2023011611",
                            "symbol": "USDC",
                            "amount": "1.722093",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673872200000,
                            "rewardEndTime": 1989232200000,
                            "createdTime": 1673872200000,
                            "updatedTime": 1673872200000
                        }, {
                            "rewardId": "2023011610",
                            "symbol": "USDC",
                            "amount": "0.10346",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673868600000,
                            "rewardEndTime": 1989228600000,
                            "createdTime": 1673868600000,
                            "updatedTime": 1673868600000
                        }, {
                            "rewardId": "202301169",
                            "symbol": "USDC",
                            "amount": "0.197997",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673865000000,
                            "rewardEndTime": 1989225000000,
                            "createdTime": 1673865000000,
                            "updatedTime": 1673865000000
                        }, {
                            "rewardId": "202301168",
                            "symbol": "USDC",
                            "amount": "0.30987",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673861400000,
                            "rewardEndTime": 1989221400000,
                            "createdTime": 1673861400000,
                            "updatedTime": 1673861400000
                        }, {
                            "rewardId": "202301166",
                            "symbol": "USDC",
                            "amount": "6.329932",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673854200000,
                            "rewardEndTime": 1989214200000,
                            "createdTime": 1673854200000,
                            "updatedTime": 1673854200000
                        }, {
                            "rewardId": "202301165",
                            "symbol": "USDC",
                            "amount": "0.05964",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673850600000,
                            "rewardEndTime": 1989210600000,
                            "createdTime": 1673850600000,
                            "updatedTime": 1673850600000
                        }, {
                            "rewardId": "202301164",
                            "symbol": "USDC",
                            "amount": "0.980348",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673847000000,
                            "rewardEndTime": 1989207000000,
                            "createdTime": 1673847000000,
                            "updatedTime": 1673847000000
                        }, {
                            "rewardId": "202301163",
                            "symbol": "USDC",
                            "amount": "0.232718",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673843400000,
                            "rewardEndTime": 1989203400000,
                            "createdTime": 1673843400000,
                            "updatedTime": 1673843400000
                        }, {
                            "rewardId": "202301162",
                            "symbol": "USDC",
                            "amount": "3.322885",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673839800000,
                            "rewardEndTime": 1989199800000,
                            "createdTime": 1673839800000,
                            "updatedTime": 1673839800000
                        }, {
                            "rewardId": "2023011515",
                            "symbol": "USDC",
                            "amount": "3.373661",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673800200000,
                            "rewardEndTime": 1989160200000,
                            "createdTime": 1673800200000,
                            "updatedTime": 1673800200000
                        }, {
                            "rewardId": "2023011513",
                            "symbol": "USDC",
                            "amount": "0.618659",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673793000000,
                            "rewardEndTime": 1989153000000,
                            "createdTime": 1673793000000,
                            "updatedTime": 1673793000000
                        }, {
                            "rewardId": "2023011512",
                            "symbol": "USDC",
                            "amount": "4.399587",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673789400000,
                            "rewardEndTime": 1989149400000,
                            "createdTime": 1673789400000,
                            "updatedTime": 1673789400000
                        }, {
                            "rewardId": "2023011511",
                            "symbol": "USDC",
                            "amount": "0.247029",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673785800000,
                            "rewardEndTime": 1989145800000,
                            "createdTime": 1673785800000,
                            "updatedTime": 1673785800000
                        }, {
                            "rewardId": "2023011510",
                            "symbol": "USDC",
                            "amount": "0.809263",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673782200000,
                            "rewardEndTime": 1989142200000,
                            "createdTime": 1673782200000,
                            "updatedTime": 1673782200000
                        }, {
                            "rewardId": "202301159",
                            "symbol": "USDC",
                            "amount": "2379.354607",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673778600000,
                            "rewardEndTime": 1989138600000,
                            "createdTime": 1673778600000,
                            "updatedTime": 1673778600000
                        }, {
                            "rewardId": "202301158",
                            "symbol": "USDC",
                            "amount": "2492.470225",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673775000000,
                            "rewardEndTime": 1989135000000,
                            "createdTime": 1673775000000,
                            "updatedTime": 1673775000000
                        }, {
                            "rewardId": "202301157",
                            "symbol": "USDC",
                            "amount": "35.941569",
                            "status": "NOT_RECEIVED",
                            "rewardStartTime": 1673771400000,
                            "rewardEndTime": 1989131400000,
                            "createdTime": 1673771400000,
                            "updatedTime": 1673771400000
                        }, { "rewardId": "202301156", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011514",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011516", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011517",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011518", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011519",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011520", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011521",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011522", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011523",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301160", "status": "NOT_AUTH" }, {
                            "rewardId": "202301161",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301167", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011613",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011615", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011617",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011618", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011620",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011621", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011622",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011623", "status": "NOT_AUTH" }, {
                            "rewardId": "202301170",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301174", "status": "NOT_AUTH" }, {
                            "rewardId": "202301175",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301176", "status": "NOT_AUTH" }, {
                            "rewardId": "202301177",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301179", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011710",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011711", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011712",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011714", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011715",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011716", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011717",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011718", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011719",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011720", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011721",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011722", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011723",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301180", "status": "NOT_AUTH" }, {
                            "rewardId": "202301181",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301182", "status": "NOT_AUTH" }, {
                            "rewardId": "202301183",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301184", "status": "NOT_AUTH" }, {
                            "rewardId": "202301185",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301186", "status": "NOT_AUTH" }, {
                            "rewardId": "202301187",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301188", "status": "NOT_AUTH" }, {
                            "rewardId": "202301189",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011810", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011811",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011812", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011813",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011814", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011815",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011816", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011817",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011818", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011819",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011820", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011821",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "2023011822", "status": "NOT_AUTH" }, {
                            "rewardId": "2023011823",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301190", "status": "NOT_AUTH" }, {
                            "rewardId": "202301191",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301192", "status": "NOT_AUTH" }, {
                            "rewardId": "202301193",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301194", "status": "NOT_AUTH" }, {
                            "rewardId": "202301195",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301196", "status": "NOT_AUTH" }, {
                            "rewardId": "202301197",
                            "status": "NOT_AUTH"
                        }, { "rewardId": "202301198", "status": "NOT_AUTH" }, { "rewardId": "202301199", "status": "NOT_AUTH" }],
                    "lastWeekUserReward": ""
                }, "timeCost": 49885308
            }
        };
        const stakingUserData = (0, tool_1.getValue)(stakingUserDataResp, 'data.data', {});
        const totalApexStake = (0, tool_1.getValue)(apexPoolStakeInfos, '[0].apex', '0');
        const totalEsApexStake = (0, tool_1.getValue)(apexPoolStakeInfos, '[0].esApex', '0');
        const esApexStake = {
            lastTotalStakeAmount: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.lastTotalStakeAmount', '0'),
            t2eFactor: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.t2eFactor', '0'),
            lastUserStakeAmount: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.lastUserStakeAmount', '0'),
            timeFactor: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.timeFactor', '0'),
            avgStakeTime: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.avgStakeTime', '0'),
            totalFactor: '0',
        };
        esApexStake.totalFactor = ApexPoolMathTool_1.ApexPoolMathTool.totalFactor(esApexStake.t2eFactor, esApexStake.timeFactor).totalFactor;
        const apexStake = {
            lastTotalStakeAmount: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.lastTotalStakeAmount', '0'),
            t2eFactor: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.t2eFactor', '0'),
            lastUserStakeAmount: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.lastUserStakeAmount', '0'),
            timeFactor: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.timeFactor', '0'),
            avgStakeTime: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.avgStakeTime', '0'),
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
            avgStakeTime
        };
    }
};
RequestService = __decorate([
    (0, tool_1.CacheKey)('RequestService'),
    __metadata("design:paramtypes", [])
], RequestService);
exports.RequestService = RequestService;
