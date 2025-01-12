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
exports.ApexPoolService = void 0;
const BaseService_1 = require("./BaseService");
const ConnectInfo_1 = require("../ConnectInfo");
const tool_1 = require("./tool");
const vo_1 = require("./vo");
const abi_1 = require("./abi");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ApexPoolMathTool_1 = require("./tool/ApexPoolMathTool");
const api_1 = require("./api");
/**
 * Bonus API
 */
let ApexPoolService = class ApexPoolService extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    async stakeInfo(accountId, privateApi) {
        const user = this.connectInfo.account;
        const apexPool = this.connectInfo.create(abi_1.IApexPool2);
        const apexAddress = this.connectInfo.isArbi()
            ? this.connectInfo.addressInfo.arbiApex
            : this.connectInfo.addressInfo.apex;
        const esApexAddress = this.connectInfo.isArbi()
            ? this.connectInfo.addressInfo.arbiApex
            : this.connectInfo.addressInfo.esApex;
        const apexPoolAddress = this.connectInfo.isArbi()
            ? this.connectInfo.addressInfo.arbiApexPool
            : this.connectInfo.addressInfo.apexPool;
        let apexBalance;
        let esApexBalance;
        let stakingInfo;
        if (this.connectInfo.isArbi()) {
            const apexErc20 = this.connectInfo.create(abi_1.ERC20, apexAddress);
            [apexBalance, esApexBalance, stakingInfo] = await this.connectInfo.multiCall().call({
                balance: apexErc20.erc20Instance.balanceOf(user),
                decimals: apexErc20.erc20Instance.decimals(),
                allowance: apexErc20.erc20Instance.allowance(user, apexPoolAddress),
            }, {
                balance: '0',
                decimals: '0',
                allowance: '0',
            }, {
                stakingAPEX: apexPool.apexPoolInstance.stakingAPEX(user, accountId),
                stakingEsAPEX: '0',
            });
        }
        else {
            const apexErc20 = this.connectInfo.create(abi_1.ERC20, apexAddress);
            const esApexErc20 = this.connectInfo.create(abi_1.ERC20, esApexAddress);
            [apexBalance, esApexBalance, stakingInfo] = await this.connectInfo.multiCall().call({
                balance: apexErc20.erc20Instance.balanceOf(user),
                decimals: apexErc20.erc20Instance.decimals(),
                allowance: apexErc20.erc20Instance.allowance(user, apexPoolAddress),
            }, {
                balance: esApexErc20.erc20Instance.balanceOf(user),
                decimals: esApexErc20.erc20Instance.decimals(),
                allowance: esApexErc20.erc20Instance.allowance(user, apexPoolAddress),
            }, {
                stakingAPEX: apexPool.apexPoolInstance.stakingAPEX(user, accountId),
                stakingEsAPEX: apexPool.apexPoolInstance.stakingEsAPEX(user, accountId),
            });
        }
        const [apexPrice, apiStakeInfo] = await Promise.all([
            this.connectInfo.api().apexPrice(),
            this.connectInfo.api().apexPoolStakeInfo(user, privateApi),
        ]);
        const apexPoolStakeInfo = new vo_1.ApexPoolStakeInfo();
        apexPoolStakeInfo.round = apiStakeInfo.round;
        apexPoolStakeInfo.totalStakeApex = apiStakeInfo.totalApexStake;
        apexPoolStakeInfo.totalStakeEsApex = apiStakeInfo.totalEsApexStake;
        apexPoolStakeInfo.userTotalStakedAPEX = apiStakeInfo.userTotalApexStake;
        apexPoolStakeInfo.userTotalStakedEsAPEX = apiStakeInfo.userTotalEsApexStake;
        apexPoolStakeInfo.tradingActivityFactor = apiStakeInfo.tradingActivityFactor;
        apexPoolStakeInfo.rewardLastPeriod = apiStakeInfo.lastWeekTotalStakingReward;
        apexPoolStakeInfo.unclaimRewards = apiStakeInfo.rewardList
            .filter((it) => it.canClaim)
            .map((it) => it.amount)
            .reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0');
        // unauth: UNKNOWN_RECORD_STATUS | NOT_AUTH;
        // complete: RECEIVED | ARRIVE | ARRIVE_L2_APPROVED;
        // auth: NOT_RECEIVED;
        // fail: VERIFY_FAIL | SIGN_FAIL | RECEIVED_FAIL | ARRIVE_FAIL;
        const successStatusSet = new Set(Array.from(["RECEIVED", "ARRIVE", "ARRIVE_L2_APPROVED"]));
        apexPoolStakeInfo.claimRewards = apiStakeInfo.rewardList
            .filter((it) => successStatusSet.has(it.status))
            .map((it) => it.amount)
            .reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0');
        apexPoolStakeInfo.totalEarnedReward = apiStakeInfo.rewardList
            .map((it) => it.amount)
            .reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0');
        apexPoolStakeInfo.stakingHoldingsList = apiStakeInfo.stakingHoldingsList;
        apexPoolStakeInfo.rewardList = apiStakeInfo.rewardList;
        apexPoolStakeInfo.userStakedAPEX = new bignumber_js_1.default(stakingInfo.stakingAPEX).div(10 ** apexBalance.decimals).toFixed();
        apexPoolStakeInfo.userStakedEsAPEX = new bignumber_js_1.default(stakingInfo.stakingEsAPEX)
            .div(10 ** esApexBalance.decimals)
            .toFixed();
        apexPoolStakeInfo.apexBalance = new bignumber_js_1.default(apexBalance.balance).div(10 ** apexBalance.decimals).toFixed();
        apexPoolStakeInfo.esApexBalance = new bignumber_js_1.default(esApexBalance.balance).div(10 ** esApexBalance.decimals).toFixed();
        apexPoolStakeInfo.showApexApprove = (0, tool_1.showApprove)(apexBalance);
        apexPoolStakeInfo.showEsApexApprove = (0, tool_1.showApprove)(esApexBalance);
        apexPoolStakeInfo.apexAllowance = new bignumber_js_1.default(apexBalance.allowance).div(10 ** apexBalance.decimals).toFixed();
        apexPoolStakeInfo.esApexAllowance = new bignumber_js_1.default(esApexBalance.allowance)
            .div(10 ** esApexBalance.decimals)
            .toFixed();
        apexPoolStakeInfo.apy = ApexPoolMathTool_1.ApexPoolMathTool.APY(apiStakeInfo.lastWeekTotalStakingReward, apiStakeInfo.lastWeekTotalStake, apexPrice.price, new bignumber_js_1.default(apiStakeInfo.totalAvgStakeTime).div(86400).toFixed()).apy;
        apexPoolStakeInfo.userApy = ApexPoolMathTool_1.ApexPoolMathTool.APY(apiStakeInfo.lastWeekUserReward, new bignumber_js_1.default(apiStakeInfo.apexStake.lastUserStakeAmount)
            .plus(apiStakeInfo.esApexStake.lastUserStakeAmount)
            .toFixed(), apexPrice.price, new bignumber_js_1.default(apiStakeInfo.avgStakeTime).div(86400).toFixed()).apy;
        apexPoolStakeInfo.approve = async (token) => {
            if (token === 'apex') {
                return this.connectInfo.erc20().approve(apexPoolAddress, apexAddress);
            }
            else {
                return this.connectInfo.erc20().approve(apexPoolAddress, esApexAddress);
            }
        };
        apexPoolStakeInfo.preStake = async (token) => {
            const stake = token === 'apex' ? apiStakeInfo.apexStake : apiStakeInfo.esApexStake;
            const t2eFactor = stake.t2eFactor;
            const tradingActivityFactor = stake.tradingActivityFactor;
            const timeFactor = stake.timeFactor;
            const totalFactor = stake.totalFactor;
            return {
                tradingActivityFactor,
                t2eFactor,
                timeFactor,
                totalFactor,
            };
        };
        apexPoolStakeInfo.stake = async (token, amount) => {
            const value = new bignumber_js_1.default(amount).multipliedBy(1e18).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            if (token === 'apex') {
                return apexPool.stakeAPEX(accountId, value);
            }
            else {
                return apexPool.stakeEsAPEX(accountId, value);
            }
        };
        apexPoolStakeInfo.unStake = async (token, amount) => {
            const value = new bignumber_js_1.default(amount).multipliedBy(1e18).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            if (token === 'apex') {
                return apexPool.unstakeAPEX(user, accountId, value);
            }
            else {
                return apexPool.unstakeEsAPEX(user, accountId, value);
            }
        };
        return apexPoolStakeInfo;
    }
    async getActionsHistory(user, actions = ['stakeApex', 'unstakeApex', 'stakeEsApex', 'unstakeEsApex']) {
        const [mainnetResult, arbiResult] = await Promise.all([
            this.connectInfo.api().baseApi.bananaGraph((0, api_1.getUserActionsHistory)(), {
                user,
                actions,
            }),
            this.connectInfo.api().baseApi.arbiBananaGraph((0, api_1.getUserActionsHistory)(), {
                user,
                actions,
            }),
        ]);
        const bananaUserActionsLogs = mainnetResult.bananaUserActionsLogs;
        const arbiBananaUserActionsLogs = arbiResult.bananaUserActionsLogs;
        const historyRecords = [];
        const convertApexPoolActionsHistory = (chain) => {
            return (data) => {
                const it = data;
                const history = new vo_1.ApexPoolActionsHistory();
                history.action = it.action;
                history.apex = it.apex;
                history.esApex = it.esApex;
                history.timestamp = it.timestamp;
                history.hash = it.hash;
                history.chain = chain;
                history.hashLink =
                    chain === 'arbitrum' ? this.addressInfo.getArbiScanTx(it.hash) : this.addressInfo.getEtherscanTx(it.hash);
                return history;
            };
        };
        historyRecords.push(...Array.from(bananaUserActionsLogs).map(convertApexPoolActionsHistory('ethereum')));
        historyRecords.push(...Array.from(arbiBananaUserActionsLogs).map(convertApexPoolActionsHistory('arbitrum')));
        historyRecords.sort((a, b) => new bignumber_js_1.default(b.timestamp).comparedTo(a.timestamp));
        return {
            historyRecords,
        };
    }
};
ApexPoolService = __decorate([
    (0, tool_1.CacheKey)('ApexPoolService'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], ApexPoolService);
exports.ApexPoolService = ApexPoolService;
