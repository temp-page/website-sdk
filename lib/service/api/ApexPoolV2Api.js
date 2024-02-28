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
exports.ApexPoolV2Api = void 0;
const tool_1 = require("../tool");
const BaseApi_1 = require("./BaseApi");
const gql_1 = require("./gql");
const ApexPoolMathTool_1 = require("../tool/ApexPoolMathTool");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const abi_1 = require("../abi");
let ApexPoolV2Api = class ApexPoolV2Api {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    async apexPoolAPY() {
        const apexRegularStakingConfig = this.baseApi.address().apexRegularStaking;
        const [apexPrice, apiStakeInfo, mainnetApexPoolStakeInfos, arbiApexPoolStakeInfos, mainnetRegularApexPoolStakeInfos, arbiRegularApexPoolStakeInfos] = await Promise.all([
            this.baseApi.address().getApiService().apexPrice(),
            this.baseApi.apiBaseRequest(`/api/v1/staking/staking-user-data`, 'get', {}),
            this.baseApi.graphBase(apexRegularStakingConfig.common.graphUrlV2, (0, gql_1.getApexPoolStakeInfos)(), {}),
            this.baseApi.graphBase(apexRegularStakingConfig.arbi.graphUrlV2, (0, gql_1.getApexPoolStakeInfos)(), {}),
            this.baseApi.graphBase(apexRegularStakingConfig.common.graphUrlV3, (0, gql_1.getApexPoolStakeInfos)(), {}),
            this.baseApi.graphBase(apexRegularStakingConfig.arbi.graphUrlV3, (0, gql_1.getApexPoolStakeInfos)(), {}),
        ]);
        const apy = ApexPoolMathTool_1.ApexPoolMathTool.APY((0, tool_1.getValue)(apiStakeInfo, 'lastWeekTotalStakingReward', '0'), (0, tool_1.getValue)(apiStakeInfo, 'lastWeekTotalStake', '0'), apexPrice.price, new bignumber_js_1.default((0, tool_1.getValue)(apiStakeInfo, 'apexStakingApyFactor.totalAvgStakeTime', '0')).div(86400).toFixed()).apy;
        // goerli or mainnet 质押数据
        const mainnetTotalApexStake = (0, tool_1.getValue)(mainnetApexPoolStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const mainnetTotalEsApexStake = (0, tool_1.getValue)(mainnetApexPoolStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        // goerli-arbi or arbi 质押数据
        const arbiTotalApexStake = (0, tool_1.getValue)(arbiApexPoolStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const arbiTotalEsApexStake = (0, tool_1.getValue)(arbiApexPoolStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        // goerli or mainnet 质押数据
        const mainnetRegularTotalApexStake = (0, tool_1.getValue)(mainnetRegularApexPoolStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const mainnetRegularTotalEsApexStake = (0, tool_1.getValue)(mainnetRegularApexPoolStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        // goerli-arbi or arbi 质押数据
        const arbiRegularTotalApexStake = (0, tool_1.getValue)(arbiRegularApexPoolStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const arbiRegularTotalEsApexStake = (0, tool_1.getValue)(arbiRegularApexPoolStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        const totalApexStake = new bignumber_js_1.default(mainnetTotalApexStake).plus(arbiTotalApexStake).plus(mainnetRegularTotalApexStake).plus(arbiRegularTotalApexStake).toFixed();
        const totalEsApexStake = new bignumber_js_1.default(mainnetTotalEsApexStake).plus(arbiTotalEsApexStake).plus(mainnetRegularTotalEsApexStake).plus(arbiRegularTotalEsApexStake).toFixed();
        const lastWeekTotalStakingReward = (0, tool_1.getValue)(apiStakeInfo, 'lastWeekTotalStakingReward', '0');
        const avgRegularTime = new bignumber_js_1.default((0, tool_1.getValue)(apiStakeInfo, 'apexStakingApyFactor.totalAvgStakeTime', '0')).toFixed();
        return {
            apy,
            totalApexStake,
            totalEsApexStake,
            lastWeekTotalStakingReward,
            avgRegularTime,
        };
    }
    async apexPoolStakeInfo(address, privateApi) {
        const apexRegularStakingConfig = this.baseApi.address().apexRegularStaking;
        const [mainnetApexPoolStakeInfos, arbiApexPoolStakeInfos, mainnetApexPoolRegularStakeInfos, arbiApexPoolRegularStakeInfos, stakingUserDataResp] = await Promise.all([
            this.baseApi.graphBase(apexRegularStakingConfig.common.graphUrlV2, (0, gql_1.getUserApexPoolStakeInfos)(), { user: address }),
            this.baseApi.graphBase(apexRegularStakingConfig.arbi.graphUrlV2, (0, gql_1.getUserApexPoolStakeInfos)(), { user: address }),
            this.baseApi.graphBase(apexRegularStakingConfig.common.graphUrlV3, (0, gql_1.getUserApexPoolStakeInfos)(), { user: address }),
            this.baseApi.graphBase(apexRegularStakingConfig.arbi.graphUrlV3, (0, gql_1.getUserApexPoolStakeInfos)(), { user: address }),
            privateApi.get(`/api/v1/staking/staking-user-data`, {}),
        ]);
        // goerli or mainnet 质押数据
        const mainnetTotalApexStake = (0, tool_1.getValue)(mainnetApexPoolStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const mainnetTotalEsApexStake = (0, tool_1.getValue)(mainnetApexPoolStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        // goerli-arbi or arbi 质押数据
        const arbiTotalApexStake = (0, tool_1.getValue)(arbiApexPoolStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const arbiTotalEsApexStake = (0, tool_1.getValue)(arbiApexPoolStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        // goerli or mainnet 质押数据
        const userMainnetTotalApexStake = (0, tool_1.getValue)(mainnetApexPoolStakeInfos.userStakeInfos, '[0].apex', '0');
        const userMainnetTotalEsApexStake = (0, tool_1.getValue)(mainnetApexPoolStakeInfos.userStakeInfos, '[0].esApex', '0');
        // goerli-arbi or arbi 质押数据
        const userArbiTotalApexStake = (0, tool_1.getValue)(arbiApexPoolStakeInfos.userStakeInfos, '[0].apex', '0');
        const userArbiTotalEsApexStake = (0, tool_1.getValue)(arbiApexPoolStakeInfos.userStakeInfos, '[0].esApex', '0');
        // goerli or mainnet 质押数据
        const mainnetRegularTotalApexStake = (0, tool_1.getValue)(mainnetApexPoolRegularStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const mainnetRegularTotalEsApexStake = (0, tool_1.getValue)(mainnetApexPoolRegularStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        // goerli-arbi or arbi 质押数据
        const arbiRegularTotalApexStake = (0, tool_1.getValue)(arbiApexPoolRegularStakeInfos.apexPoolStakeInfos, '[0].apex', '0');
        const arbiRegularTotalEsApexStake = (0, tool_1.getValue)(arbiApexPoolRegularStakeInfos.apexPoolStakeInfos, '[0].esApex', '0');
        // goerli or mainnet 质押数据
        const userMainnetRegularTotalApexStake = (0, tool_1.getValue)(mainnetApexPoolRegularStakeInfos.userStakeInfos, '[0].apex', '0');
        const userMainnetRegularTotalEsApexStake = (0, tool_1.getValue)(mainnetApexPoolRegularStakeInfos.userStakeInfos, '[0].esApex', '0');
        // goerli-arbi or arbi 质押数据
        const userArbiRegularTotalApexStake = (0, tool_1.getValue)(arbiApexPoolRegularStakeInfos.userStakeInfos, '[0].apex', '0');
        const userArbiRegularTotalEsApexStake = (0, tool_1.getValue)(arbiApexPoolRegularStakeInfos.userStakeInfos, '[0].esApex', '0');
        const totalApexStake = new bignumber_js_1.default(mainnetTotalApexStake).plus(arbiTotalApexStake).plus(mainnetRegularTotalApexStake).plus(arbiRegularTotalApexStake).toFixed();
        const totalEsApexStake = new bignumber_js_1.default(mainnetTotalEsApexStake).plus(arbiTotalEsApexStake).plus(mainnetRegularTotalEsApexStake).plus(arbiRegularTotalEsApexStake).toFixed();
        const userTotalApexStake = new bignumber_js_1.default(userMainnetTotalApexStake).plus(userArbiTotalApexStake).plus(userMainnetRegularTotalApexStake).plus(userArbiRegularTotalApexStake).toFixed();
        const userTotalEsApexStake = new bignumber_js_1.default(userMainnetTotalEsApexStake).plus(userArbiTotalEsApexStake).plus(userMainnetRegularTotalEsApexStake).plus(userArbiRegularTotalEsApexStake).toFixed();
        const stakingUserData = (0, tool_1.getValue)(stakingUserDataResp, 'data.data', {});
        const esApexStake = {
            lastTotalStakeAmount: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.lastTotalStakeAmount', '0'),
            t2eFactor: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.t2eFactor', '0'),
            lastUserStakeAmount: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.lastUserStakeAmount', '0'),
            timeFactor: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.timeFactor', '0'),
            tradingActivityFactor: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.tradingActivityFactor', '0'),
            avgStakeTime: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.avgStakeTime', '0'),
            totalAvgStakeTime: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.totalAvgStakeTime', '0'),
            totalFactor: '0',
            newTimeFactor: (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.newTimeFactor', '0'),
        };
        esApexStake.totalFactor = ApexPoolMathTool_1.ApexPoolMathTool.totalFactor(esApexStake.tradingActivityFactor, esApexStake.timeFactor).totalFactor;
        const apexStake = {
            lastTotalStakeAmount: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.lastTotalStakeAmount', '0'),
            t2eFactor: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.t2eFactor', '0'),
            lastUserStakeAmount: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.lastUserStakeAmount', '0'),
            timeFactor: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.timeFactor', '0'),
            tradingActivityFactor: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.tradingActivityFactor', '0'),
            avgStakeTime: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.avgStakeTime', '0'),
            totalAvgStakeTime: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.totalAvgStakeTime', '0'),
            totalFactor: '0',
            newTimeFactor: (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.newTimeFactor', '0'),
        };
        apexStake.totalFactor = ApexPoolMathTool_1.ApexPoolMathTool.totalFactor(apexStake.tradingActivityFactor, apexStake.timeFactor).totalFactor;
        const appId = (0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.appId', (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.appId', '') || '');
        const tradingActivityFactor = bignumber_js_1.default.max((0, tool_1.getValue)(stakingUserData, 'apexStakingApyFactor.tradingActivityFactor', '0'), (0, tool_1.getValue)(stakingUserData, 'esApexStakingApyFactor.tradingActivityFactor', '0')).toFixed(1);
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
        const round = (0, tool_1.getValue)(stakingUserData, 'currentRound', 0);
        const avgStakeTime = ApexPoolMathTool_1.ApexPoolMathTool.avgStakeTime(apexStake, esApexStake).avgStakeTime;
        const totalAvgStakeTime = esApexStake.totalAvgStakeTime;
        const avgRegularTime = apexStake.totalAvgStakeTime;
        const userRegularTotalApexStake = new bignumber_js_1.default(userMainnetRegularTotalApexStake).plus(userArbiRegularTotalApexStake).toFixed();
        const userRegularTotalEsApexStake = new bignumber_js_1.default(userMainnetRegularTotalEsApexStake).plus(userArbiRegularTotalEsApexStake).toFixed();
        const userCurrentTotalApexStake = new bignumber_js_1.default(userMainnetTotalApexStake).plus(userArbiTotalApexStake).toFixed();
        const userCurrentTotalEsApexStake = new bignumber_js_1.default(userMainnetTotalEsApexStake).plus(userArbiTotalEsApexStake).toFixed();
        const stakingHoldingsList = Array.from((0, tool_1.getValue)(stakingUserData, 'stakingHoldings', []));
        const userLockPeriodWeightedTime = (0, tool_1.getValue)(stakingUserData, 'lockPeriodWeightedTime', '0');
        return {
            tradingActivityFactor,
            totalApexStake,
            totalEsApexStake,
            userTotalApexStake,
            userTotalEsApexStake,
            round,
            rewardList,
            lastWeekTotalStakingReward,
            lastWeekUserReward,
            lastWeekTotalStake,
            apexStake,
            esApexStake,
            stakingHoldingsList,
            avgStakeTime,
            userLockPeriodWeightedTime,
            totalAvgStakeTime,
            avgRegularTime,
            userRegularTotalApexStake,
            userRegularTotalEsApexStake,
            userCurrentTotalApexStake,
            userCurrentTotalEsApexStake
        };
    }
    async stakeInfo(accountId, privateApi, connectInfo) {
        const user = connectInfo.account;
        const apexPool = connectInfo.create(abi_1.IApexPool2V2);
        const apexPoolV3 = connectInfo.create(abi_1.IApexPool3);
        const apexRegularStakingConfig = connectInfo.addressInfo.apexRegularStaking;
        const apexAddress = connectInfo.isArbi()
            ? apexRegularStakingConfig.arbi.apex
            : apexRegularStakingConfig.common.apex;
        const esApexAddress = connectInfo.isArbi()
            ? apexRegularStakingConfig.arbi.esApex
            : apexRegularStakingConfig.common.esApex;
        const apexPoolAddress = connectInfo.isArbi()
            ? apexRegularStakingConfig.arbi.apexPoolV2
            : apexRegularStakingConfig.common.apexPoolV2;
        const apexPoolV3Address = connectInfo.isArbi()
            ? apexRegularStakingConfig.arbi.apexPoolV3
            : apexRegularStakingConfig.common.apexPoolV3;
        let apexBalance;
        let esApexBalance;
        let stakingInfo;
        let userStake;
        if (connectInfo.isArbi()) {
            const apexErc20 = connectInfo.create(abi_1.ERC20, apexAddress);
            const esApexErc20 = connectInfo.create(abi_1.ERC20, esApexAddress);
            [apexBalance, esApexBalance, stakingInfo] = await connectInfo.multiCall().call({
                balance: apexErc20.erc20Instance.balanceOf(user),
                decimals: apexErc20.erc20Instance.decimals(),
                allowance: apexErc20.erc20Instance.allowance(user, apexPoolAddress),
                allowanceApexPoolV3: apexErc20.erc20Instance.allowance(user, apexPoolV3Address),
            }, {
                balance: esApexErc20.erc20Instance.balanceOf(user),
                decimals: esApexErc20.erc20Instance.decimals(),
                allowance: esApexErc20.erc20Instance.allowance(user, apexPoolAddress),
                allowanceApexPoolV3: esApexErc20.erc20Instance.allowance(user, apexPoolV3Address),
            }, {
                stakingAPEX: apexPool.apexPoolInstance.stakingAPEX(user, accountId),
                stakingEsAPEX: '0',
            });
            userStake = await this.baseApi.graphBase(apexRegularStakingConfig.arbi.graphUrlV3, (0, gql_1.getApexPoolV3StakeInfo)(), { user });
        }
        else {
            const apexErc20 = connectInfo.create(abi_1.ERC20, apexAddress);
            const esApexErc20 = connectInfo.create(abi_1.ERC20, esApexAddress);
            [apexBalance, esApexBalance, stakingInfo] = await connectInfo.multiCall().call({
                balance: apexErc20.erc20Instance.balanceOf(user),
                decimals: apexErc20.erc20Instance.decimals(),
                allowance: apexErc20.erc20Instance.allowance(user, apexPoolAddress),
                allowanceApexPoolV3: apexErc20.erc20Instance.allowance(user, apexPoolV3Address),
            }, {
                balance: esApexErc20.erc20Instance.balanceOf(user),
                decimals: esApexErc20.erc20Instance.decimals(),
                allowance: esApexErc20.erc20Instance.allowance(user, apexPoolAddress),
                allowanceApexPoolV3: esApexErc20.erc20Instance.allowance(user, apexPoolV3Address),
            }, {
                stakingAPEX: apexPool.apexPoolInstance.stakingAPEX(user, accountId),
                stakingEsAPEX: apexPool.apexPoolInstance.stakingEsAPEX(user, accountId),
            });
            userStake = await this.baseApi.graphBase(apexRegularStakingConfig.common.graphUrlV3, (0, gql_1.getApexPoolV3StakeInfo)(), { user });
        }
        const [apexPrice, apiStakeInfo] = await Promise.all([
            connectInfo.api().apexPrice(),
            this.apexPoolStakeInfo(user, privateApi),
        ]);
        const stakingHoldingsList = apiStakeInfo.stakingHoldingsList;
        const apexPoolStakeInfo = {
            round: apiStakeInfo.round,
            apexAllowance: new bignumber_js_1.default(apexBalance.allowanceApexPoolV3).div(10 ** apexBalance.decimals).toFixed(),
            esApexAllowance: new bignumber_js_1.default(esApexBalance.allowanceApexPoolV3).div(10 ** esApexBalance.decimals).toFixed(),
            userLockPeriodWeightedTime: apiStakeInfo.userLockPeriodWeightedTime,
            totalStakeApex: apiStakeInfo.totalApexStake,
            totalStakeEsApex: apiStakeInfo.totalEsApexStake,
            avgRegularTime: apiStakeInfo.avgRegularTime,
            userTotalStakedAPEX: apiStakeInfo.userTotalApexStake,
            userTotalStakedEsAPEX: apiStakeInfo.userTotalEsApexStake,
            tradingActivityFactor: apiStakeInfo.tradingActivityFactor,
            rewardLastPeriod: apiStakeInfo.lastWeekTotalStakingReward,
            unclaimRewards: apiStakeInfo.rewardList.filter((it) => it.canClaim).map((it) => it.amount).reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0'),
            claimRewards: apiStakeInfo.rewardList.filter((it) => !it.canClaim).map((it) => it.amount).reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0'),
            totalEarnedReward: apiStakeInfo.rewardList.map((it) => it.amount).reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0'),
            stakingHoldingsList,
            rewardList: apiStakeInfo.rewardList,
            userStakedAPEX: new bignumber_js_1.default(stakingInfo.stakingAPEX).div(10 ** apexBalance.decimals).toFixed(),
            userStakedEsAPEX: new bignumber_js_1.default(stakingInfo.stakingEsAPEX).div(10 ** esApexBalance.decimals).toFixed(),
            apexBalance: new bignumber_js_1.default(apexBalance.balance).div(10 ** apexBalance.decimals).toFixed(),
            esApexBalance: new bignumber_js_1.default(esApexBalance.balance).div(10 ** esApexBalance.decimals).toFixed(),
            apy: ApexPoolMathTool_1.ApexPoolMathTool.APY(apiStakeInfo.lastWeekTotalStakingReward, apiStakeInfo.lastWeekTotalStake, apexPrice.price, new bignumber_js_1.default(apiStakeInfo.totalAvgStakeTime).div(86400).toFixed()).apy,
            userApy: ApexPoolMathTool_1.ApexPoolMathTool.APY(apiStakeInfo.lastWeekUserReward, new bignumber_js_1.default(apiStakeInfo.apexStake.lastUserStakeAmount).plus(apiStakeInfo.esApexStake.lastUserStakeAmount).toFixed(), apexPrice.price, new bignumber_js_1.default(apiStakeInfo.avgStakeTime).div(86400).toFixed()).apy,
            userRegularCanUnStakeApex: userStake.stakeInfos.filter(it => new bignumber_js_1.default(it.stakeTime).plus(it.lockPeriod).comparedTo(new Date().getTime() / 1000) < 0 && it.tokenName === 'apex').map(it => it.amount).reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0'),
            userRegularCanUnStakeEsApex: userStake.stakeInfos.filter(it => new bignumber_js_1.default(it.stakeTime).plus(it.lockPeriod).comparedTo(new Date().getTime() / 1000) < 0 && it.tokenName === 'esApex').map(it => it.amount).reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0'),
            userCurrentTotalApexStake: apiStakeInfo.userCurrentTotalApexStake,
            userCurrentTotalEsApexStake: apiStakeInfo.userCurrentTotalEsApexStake,
            checkApprove: (token, amount, lockPeriod) => {
                const value = new bignumber_js_1.default(amount).multipliedBy(token === 'apex' ? (10 ** apexBalance.decimals) : (10 ** esApexBalance.decimals)).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
                let allowance = "0";
                if (token === 'apex') {
                    if (new bignumber_js_1.default(lockPeriod).comparedTo("0") === 0) {
                        allowance = apexBalance.allowance;
                    }
                    else {
                        allowance = apexBalance.allowanceApexPoolV3;
                    }
                }
                else {
                    if (new bignumber_js_1.default(lockPeriod).comparedTo("0") === 0) {
                        allowance = esApexBalance.allowance;
                    }
                    else {
                        allowance = esApexBalance.allowanceApexPoolV3;
                    }
                }
                return new bignumber_js_1.default(allowance).comparedTo(value) < 0;
            },
            approve: async (token, lockPeriod) => {
                let tokenAddress = apexAddress;
                let approveAddress = apexPoolAddress;
                if (token === 'esApex') {
                    tokenAddress = esApexAddress;
                }
                if (new bignumber_js_1.default(lockPeriod).comparedTo(0) > 0) {
                    approveAddress = apexPoolV3Address;
                }
                return connectInfo.erc20().approve(approveAddress, tokenAddress);
            },
            preStake: async (token, lockPeriod) => {
                const stake = token === 'apex' ? apiStakeInfo.apexStake : apiStakeInfo.esApexStake;
                const t2eFactor = stake.t2eFactor;
                const tradingActivityFactor = stake.tradingActivityFactor;
                let timeFactor = "0";
                if (new bignumber_js_1.default(lockPeriod).comparedTo("0") > 0) {
                    timeFactor = new bignumber_js_1.default(lockPeriod).div(365).toFixed();
                }
                const totalFactor = stake.totalFactor;
                return {
                    tradingActivityFactor,
                    t2eFactor,
                    timeFactor,
                    totalFactor,
                };
            },
            stake: async (token, amount, lockPeriod) => {
                const value = new bignumber_js_1.default(amount).multipliedBy(token === 'apex' ? (10 ** apexBalance.decimals) : (10 ** esApexBalance.decimals)).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
                if (new bignumber_js_1.default(lockPeriod).comparedTo("0") === 0) {
                    if (token === 'apex') {
                        return apexPool.stakeAPEX(accountId, value);
                    }
                    else {
                        return apexPool.stakeEsAPEX(accountId, value);
                    }
                }
                else {
                    if (token === 'apex') {
                        return apexPoolV3.stakeAPEX(accountId, value, lockPeriod);
                    }
                    else {
                        return apexPoolV3.stakeEsAPEX(accountId, value, lockPeriod);
                    }
                }
            },
            unStake: async (token, amount) => {
                const value = new bignumber_js_1.default(amount).multipliedBy(token === 'apex' ? (10 ** apexBalance.decimals) : (10 ** esApexBalance.decimals)).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
                if (token === 'apex') {
                    return apexPool.unstakeAPEX(user, accountId, value);
                }
                else {
                    return apexPool.unstakeEsAPEX(user, accountId, value);
                }
            },
            unStakeRegular: (token) => {
                const stakeIds = userStake.stakeInfos.filter(it => new bignumber_js_1.default(it.stakeTime).plus(it.lockPeriod).comparedTo(new Date().getTime() / 1000) < 0 && it.tokenName === 'apex').map(it => it.stakeId);
                if (stakeIds.length === 0) {
                    throw new Error("No stake can be withdrawn");
                }
                if (token === 'apex') {
                    return apexPoolV3.batchUnstakeAPEX(stakeIds);
                }
                else {
                    return apexPoolV3.batchUnstakeEsAPEX(stakeIds);
                }
            },
            unStakeRegularBtStakeId: (token, stakeId) => {
                if (token === 'apex') {
                    return apexPoolV3.unstakeAPEX(stakeId);
                }
                else {
                    return apexPoolV3.unstakeEsAPEX(stakeId);
                }
            },
            checkUnStakeHolding: async (stakingHolding) => {
                const token = stakingHolding.stakeToken;
                if (new bignumber_js_1.default(stakingHolding.chainId).comparedTo(connectInfo.chainId) === 0) {
                    if (!stakingHolding.isLockupStaking) {
                        let result;
                        if (connectInfo.isArbi()) {
                            [result] = await connectInfo.multiCall().call({
                                stakingAPEX: apexPool.apexPoolInstance.stakingAPEX(user, accountId),
                                stakingEsAPEX: '0',
                            });
                        }
                        else {
                            [result] = await connectInfo.multiCall().call({
                                stakingAPEX: apexPool.apexPoolInstance.stakingAPEX(user, accountId),
                                stakingEsAPEX: apexPool.apexPoolInstance.stakingEsAPEX(user, accountId),
                            });
                        }
                        if (token === 'apex') {
                            return new bignumber_js_1.default(stakingHolding.stakeAmount).comparedTo(new bignumber_js_1.default(result.stakingAPEX).div(10 ** apexBalance.decimals).toFixed()) <= 0;
                        }
                        else {
                            return new bignumber_js_1.default(stakingHolding.stakeAmount).comparedTo(new bignumber_js_1.default(result.stakingEsAPEX).div(10 ** esApexBalance.decimals).toFixed()) <= 0;
                        }
                    }
                    else {
                        const [result] = await connectInfo.multiCall().call({
                            staking: apexPoolV3.apexPoolInstance[token === 'apex' ? 'stakingAPEX' : 'stakingEsAPEX'](stakingHolding.stakeId),
                        });
                        const b = !result.staking.unlocked && new bignumber_js_1.default(result.staking.lockStart).plus(result.staking.lockPeriod).comparedTo(new Date().getTime() / 1000) <= 0;
                        return b;
                    }
                }
                return false;
            },
            unStakeHolding: async (stakingHolding) => {
                const token = stakingHolding.stakeToken;
                if (new bignumber_js_1.default(stakingHolding.chainId).comparedTo(connectInfo.chainId) === 0) {
                    if (!stakingHolding.isLockupStaking) {
                        const value = new bignumber_js_1.default(stakingHolding.stakeAmount).multipliedBy(token === 'apex' ? (10 ** apexBalance.decimals) : (10 ** esApexBalance.decimals)).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
                        if (token === 'apex') {
                            return apexPool.unstakeAPEX(user, accountId, value);
                        }
                        else {
                            return apexPool.unstakeEsAPEX(user, accountId, value);
                        }
                    }
                    else {
                        if (token === 'apex') {
                            return apexPoolV3.unstakeAPEX(stakingHolding.stakeId);
                        }
                        else {
                            return apexPoolV3.unstakeAPEX(stakingHolding.stakeId);
                        }
                    }
                }
                throw new Error("ChainId is not supported");
            }
        };
        return apexPoolStakeInfo;
    }
    async getActionsHistory(user, actions = ['stakeApex', 'unstakeApex', 'stakeEsApex', 'unstakeEsApex']) {
        const ac = [];
        const tokens = [];
        const address = user.toLowerCase();
        for (const action of actions) {
            if (action === 'stakeApex') {
                ac.push('stake');
                tokens.push('apex');
            }
            else if (action === 'unstakeApex') {
                ac.push('unStake');
                ac.push('unstake');
                tokens.push('apex');
            }
            else if (action === 'stakeEsApex') {
                ac.push('stake');
                tokens.push('esApex');
            }
            else if (action === 'unstakeEsApex') {
                ac.push('unStake');
                ac.push('unstake');
                tokens.push('esApex');
            }
        }
        const actionsSet = Array.from(new Set(ac));
        const tokensSet = Array.from(new Set(tokens));
        const apexRegularStakingConfig = this.baseApi.address().apexRegularStaking;
        const [mainnetResult, arbiResult, mainnetV3Result, arbiV3Result] = await Promise.all([
            this.baseApi.graphBase(apexRegularStakingConfig.common.graphUrlV2, (0, gql_1.getApexPoolV2Logs)(), {
                user: address,
                actions: actionsSet,
                tokenName: tokensSet
            }),
            this.baseApi.graphBase(apexRegularStakingConfig.arbi.graphUrlV2, (0, gql_1.getApexPoolV2Logs)(), {
                user: address,
                actions: actionsSet,
                tokenName: tokensSet
            }),
            this.baseApi.graphBase(apexRegularStakingConfig.common.graphUrlV3, (0, gql_1.getApexPoolV3Logs)(), {
                user: address,
                actions: actionsSet,
                tokenName: tokensSet
            }),
            this.baseApi.graphBase(apexRegularStakingConfig.arbi.graphUrlV3, (0, gql_1.getApexPoolV3Logs)(), {
                user: address,
                actions: actionsSet,
                tokenName: tokensSet
            }),
        ]);
        const historyRecords = [];
        const convertApexPoolActionsHistory = (chain) => {
            return (data) => {
                const it = data;
                let apex = '0';
                let esApex = '0';
                let action;
                if (it.tokenName === 'apex') {
                    apex = it.amount;
                    if (it.action === 'stake') {
                        action = 'stakeApex';
                    }
                    if (it.action === 'unStake' || it.action === 'unstake') {
                        action = 'unstakeApex';
                    }
                }
                if (it.tokenName === 'esApex') {
                    esApex = it.amount;
                    if (it.action === 'stake') {
                        action = 'stakeEsApex';
                    }
                    if (it.action === 'unStake' || it.action === 'unstake') {
                        action = 'unstakeEsApex';
                    }
                }
                return {
                    action: action,
                    apex,
                    esApex,
                    timestamp: it.timestamp,
                    lockPeriod: it.lockPeriod,
                    hash: it.hash,
                    chain,
                    hashLink: chain === 'arbitrum' ? this.baseApi.address().getArbiScanTx(it.hash) : this.baseApi.address().getEtherscanTx(it.hash)
                };
            };
        };
        historyRecords.push(...Array.from(mainnetResult.stakeLogs).map(convertApexPoolActionsHistory('ethereum')));
        historyRecords.push(...Array.from(arbiResult.stakeLogs).map(convertApexPoolActionsHistory('arbitrum')));
        historyRecords.push(...Array.from(mainnetV3Result.stakeLogs).map(convertApexPoolActionsHistory('ethereum')));
        historyRecords.push(...Array.from(arbiV3Result.stakeLogs).map(convertApexPoolActionsHistory('arbitrum')));
        historyRecords.sort((a, b) => new bignumber_js_1.default(b.timestamp).comparedTo(a.timestamp));
        return {
            historyRecords,
        };
    }
};
ApexPoolV2Api = __decorate([
    (0, tool_1.CacheKey)("ApexPoolV2Api"),
    __metadata("design:paramtypes", [])
], ApexPoolV2Api);
exports.ApexPoolV2Api = ApexPoolV2Api;
