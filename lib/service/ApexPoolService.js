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
/**
 * Bonus API
 */
let ApexPoolService = class ApexPoolService extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    async stakeInfo(accountId) {
        const user = this.connectInfo.account;
        const apexPool = this.connectInfo.create(abi_1.IApexPool2);
        const apexErc20 = this.connectInfo.create(abi_1.ERC20, this.addressInfo.apex);
        const esApexErc20 = this.connectInfo.create(abi_1.ERC20, this.addressInfo.esApex);
        const [apexPrice, apiStakeInfo] = await Promise.all([
            this.connectInfo.api().apexPrice(),
            this.connectInfo.api().apexPoolStakeInfo(accountId),
        ]);
        const [apexBalance, esApexBalance, stakingInfo] = await this.connectInfo.multiCall().call({
            balance: apexErc20.erc20Instance.balanceOf(user),
            decimals: apexErc20.erc20Instance.decimals(),
            allowance: apexErc20.erc20Instance.allowance(user, this.connectInfo.addressInfo.apexPool),
        }, {
            balance: esApexErc20.erc20Instance.balanceOf(user),
            decimals: esApexErc20.erc20Instance.decimals(),
            allowance: esApexErc20.erc20Instance.allowance(user, this.connectInfo.addressInfo.apexPool),
        }, {
            stakingAPEX: apexPool.apexPoolInstance.stakingAPEX(user),
            stakingEsAPEX: apexPool.apexPoolInstance.stakingEsAPEX(user),
        });
        const apexPoolStakeInfo = new vo_1.ApexPoolStakeInfo();
        apexPoolStakeInfo.totalStakeApex = apiStakeInfo.totalApexStake;
        apexPoolStakeInfo.totalStakeEsApex = apiStakeInfo.totalEsApexStake;
        apexPoolStakeInfo.rewardLastPeriod = apiStakeInfo.lastWeekTotalStakingReward;
        apexPoolStakeInfo.unclaimRewards = apiStakeInfo.rewardList
            .filter((it) => it.canClaim)
            .map((it) => it.amount)
            .reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0');
        apexPoolStakeInfo.totalEarnedReward = apiStakeInfo.rewardList
            .map((it) => it.amount)
            .reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0');
        apexPoolStakeInfo.userStakedAPEX = new bignumber_js_1.default(stakingInfo.stakingAPEX).div(10 ** apexBalance.decimals).toFixed();
        apexPoolStakeInfo.userStakedEsAPEX = new bignumber_js_1.default(stakingInfo.stakingEsAPEX)
            .div(10 ** esApexBalance.decimals)
            .toFixed();
        apexPoolStakeInfo.apexBalance = new bignumber_js_1.default(apexBalance.balance).div(10 ** apexBalance.decimals).toFixed();
        apexPoolStakeInfo.esApexBalance = new bignumber_js_1.default(esApexBalance.balance).div(10 ** esApexBalance.decimals).toFixed();
        apexPoolStakeInfo.showApexApprove = (0, tool_1.showApprove)(apexBalance);
        apexPoolStakeInfo.showEsApexApprove = (0, tool_1.showApprove)(esApexBalance);
        apexPoolStakeInfo.apy = ApexPoolMathTool_1.ApexPoolMathTool.APY(apiStakeInfo.lastWeekTotalStakingReward, apiStakeInfo.lastWeekTotalStake, apexPrice.price).apy;
        apexPoolStakeInfo.userApy = ApexPoolMathTool_1.ApexPoolMathTool.APY(apiStakeInfo.lastWeekUserReward, new bignumber_js_1.default(apexPoolStakeInfo.userStakedAPEX).plus(apexPoolStakeInfo.userStakedEsAPEX).toFixed(), apexPrice.price).apy;
        apexPoolStakeInfo.approve = async (token) => {
            if (token === 'apex') {
                return this.connectInfo.erc20().approve(this.addressInfo.apexPool, this.addressInfo.apex);
            }
            else {
                return this.connectInfo.erc20().approve(this.addressInfo.apexPool, this.addressInfo.esApex);
            }
        };
        apexPoolStakeInfo.preStake = async () => {
            const t2eFactor = apiStakeInfo.t2eFactor;
            const timeFactor = apiStakeInfo.timeFactor;
            const totalFactor = apiStakeInfo.totalFactor;
            return {
                t2eFactor,
                timeFactor,
                totalFactor,
            };
        };
        apexPoolStakeInfo.stake = async (token, amount) => {
            const value = new bignumber_js_1.default(amount).multipliedBy(1e18).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            if (token === 'apex') {
                return apexPool.stakeAPEX(value);
            }
            else {
                return apexPool.stakeEsAPEX(value);
            }
        };
        apexPoolStakeInfo.unStake = async (token, amount) => {
            const value = new bignumber_js_1.default(amount).multipliedBy(1e18).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            if (token === 'apex') {
                return apexPool.unstakeAPEX(user, value);
            }
            else {
                return apexPool.unstakeEsAPEX(user, value);
            }
        };
        return apexPoolStakeInfo;
    }
};
ApexPoolService = __decorate([
    (0, tool_1.CacheKey)('ApexPoolService'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], ApexPoolService);
exports.ApexPoolService = ApexPoolService;
