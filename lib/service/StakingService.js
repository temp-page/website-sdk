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
exports.StakingService = void 0;
const tool_1 = require("./tool");
const ConnectInfo_1 = require("../ConnectInfo");
const BaseService_1 = require("./BaseService");
const vo_1 = require("./vo");
const abi_1 = require("./abi");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const api_1 = require("./api");
const lodash_1 = __importDefault(require("lodash"));
let StakingService = class StakingService extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    async stakingInfo() {
        const user = this.connectInfo.account;
        const stakingPool = this.connectInfo.create(abi_1.IStakingPool2);
        const pairErc20 = this.connectInfo.create(abi_1.ERC20, this.addressInfo.pair);
        const [lpBalance, userInfo, { blockTime }] = await this.connectInfo.multiCall().call({
            balance: pairErc20.erc20Instance.balanceOf(user),
            poolBalance: pairErc20.erc20Instance.balanceOf(this.connectInfo.addressInfo.stakingPool),
            decimals: pairErc20.erc20Instance.decimals(),
            allowance: pairErc20.erc20Instance.allowance(user, this.connectInfo.addressInfo.stakingPool),
            totalSupply: pairErc20.erc20Instance.totalSupply()
        }, {
            getUserShares: stakingPool.StakingPoolInstance.getUserShares(user),
            endTime: stakingPool.StakingPoolInstance.endTime(),
            rewardsPerSecond: stakingPool.StakingPoolInstance.rewardsPerSecond(),
            minPeriod: stakingPool.StakingPoolInstance.minPeriod(),
            totalShares: stakingPool.StakingPoolInstance.totalShares(),
            rewardClaimable: stakingPool.StakingPoolInstance.rewardClaimable(user),
            withdrawable: stakingPool.StakingPoolInstance.withdrawable(user)
        }, {
            blockTime: this.connectInfo.multiCall().multicall2Instance.getCurrentBlockTimestamp()
        });
        const { stakingDepositedLogs, stakingInfos } = await this.connectInfo.api().baseApi.bananaGraph((0, api_1.getStakingInfo)(), {
            user
        });
        const executeVirtualOrdersResult = await (0, api_1.executeVirtualOrders)(this.connectInfo);
        let bananaReserves = executeVirtualOrdersResult.reserveA;
        let usdcReserves = executeVirtualOrdersResult.reserveB;
        if ((0, tool_1.eqAddress)(this.addressInfo.banana, executeVirtualOrdersResult.tokenB)) {
            bananaReserves = executeVirtualOrdersResult.reserveB;
            usdcReserves = executeVirtualOrdersResult.reserveA;
        }
        const price = new bignumber_js_1.default(usdcReserves).div(1e6).div(new bignumber_js_1.default(bananaReserves).div(1e18)).toFixed();
        const stakingInfo = new vo_1.StakingInfo();
        stakingInfo.balance = new bignumber_js_1.default(lpBalance.balance)
            .div(10 ** lpBalance.decimals)
            .toFixed();
        stakingInfo.showApprove = new bignumber_js_1.default(new bignumber_js_1.default(lpBalance.allowance).div(10 ** lpBalance.decimals)).comparedTo("100000000") <=
            0;
        stakingInfo.unlockBalance = new bignumber_js_1.default(userInfo.withdrawable)
            .div(10 ** lpBalance.decimals)
            .toFixed();
        stakingInfo.lockRecords = stakingDepositedLogs
            .filter(item => new bignumber_js_1.default(item.expireAt).comparedTo(blockTime) > 0)
            .map((item) => {
            const stakingRecord = new vo_1.StakingRecord();
            stakingRecord.stakeTime = item.timestamp;
            stakingRecord.amount = item.amount;
            stakingRecord.unLockOn = item.expireAt;
            return stakingRecord;
        });
        stakingInfo.lockBalance = stakingInfo.lockRecords.map(it => it.amount).reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), "0");
        const totalStake = lodash_1.default.get(stakingInfos, "[0].totalStake", "0");
        stakingInfo.tvl = tool_1.StakingMathTool.tvl(new bignumber_js_1.default(totalStake).multipliedBy(1e18).toFixed(), new bignumber_js_1.default(lpBalance.totalSupply).toFixed(), new bignumber_js_1.default(usdcReserves).toFixed()).tvl;
        stakingInfo.apy = tool_1.StakingMathTool.estimatedAPR(userInfo.rewardsPerSecond, price, stakingInfo.tvl, userInfo.totalShares, userInfo.totalShares).apr;
        stakingInfo.maxDay =
            tool_1.StakingMathTool.maxDay(userInfo.endTime, blockTime).day;
        stakingInfo.userEarnedBANA = new bignumber_js_1.default(userInfo.rewardClaimable)
            .div(1e18)
            .toFixed();
        // 用户LP价值
        stakingInfo.userLPValue = tool_1.StakingMathTool.tvl(new bignumber_js_1.default(stakingInfo.unlockBalance).plus(stakingInfo.lockBalance).multipliedBy(1e18).toFixed(), new bignumber_js_1.default(lpBalance.totalSupply).toFixed(), new bignumber_js_1.default(usdcReserves).toFixed()).tvl;
        stakingInfo.userAPY = tool_1.StakingMathTool.estimatedAPR(userInfo.rewardsPerSecond, price, stakingInfo.userLPValue, userInfo.getUserShares, userInfo.totalShares).apr;
        stakingInfo.preStake = async (amount, day) => {
            const amountValue = new bignumber_js_1.default(amount).multipliedBy(1e18).toFixed();
            const ONE_YEAR = 365 * 24 * 60 * 60;
            const period = new bignumber_js_1.default(day).multipliedBy(60 * 60 * 24).toFixed();
            const userNewShares = new bignumber_js_1.default(amountValue).plus(new bignumber_js_1.default(amountValue).multipliedBy(3).multipliedBy(period).div(ONE_YEAR))
                .plus(userInfo.getUserShares).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            const totalShares = userInfo.totalShares;
            const newUserTVL = tool_1.StakingMathTool.tvl(new bignumber_js_1.default(stakingInfo.unlockBalance).plus(stakingInfo.lockBalance).plus(amount).multipliedBy(1e18).toFixed(), new bignumber_js_1.default(lpBalance.totalSupply).toFixed(), new bignumber_js_1.default(usdcReserves).toFixed()).tvl;
            const estimatedAPR = tool_1.StakingMathTool.estimatedAPR(userInfo.rewardsPerSecond, price, newUserTVL, userNewShares, new bignumber_js_1.default(totalShares).plus(userNewShares).toFixed()).apr;
            const unlockOn = new bignumber_js_1.default(blockTime).plus(period).toFixed();
            const stakeLPValue = tool_1.StakingMathTool.tvl(new bignumber_js_1.default(amount).multipliedBy(1e18).toFixed(), new bignumber_js_1.default(lpBalance.totalSupply).toFixed(), new bignumber_js_1.default(usdcReserves).toFixed()).tvl;
            return {
                estimatedAPR,
                unlockOn,
                stakeLPValue
            };
        };
        stakingInfo.approve = async () => {
            return this.connectInfo.erc20().approve(this.connectInfo.addressInfo.stakingPool, this.addressInfo.pair);
        };
        stakingInfo.stake = async (amount, day) => {
            amount = new bignumber_js_1.default(amount).multipliedBy(10 ** lpBalance.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            const period = new bignumber_js_1.default(day).multipliedBy(60 * 60 * 24).toFixed();
            if (new bignumber_js_1.default(period).comparedTo("0") > 0) {
                const expireAt = new bignumber_js_1.default(period).plus(blockTime).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
                const getStakingInfoResult = await this.connectInfo.api().baseApi.bananaGraph((0, api_1.getStakingInfo)(), {
                    user
                });
                const expireAtArrays = getStakingInfoResult.stakingDepositedLogs.filter(it => new bignumber_js_1.default(it.expireAt).comparedTo(expireAt) < 0 && new bignumber_js_1.default(it.expireAt).comparedTo(blockTime) > 0)
                    .map(it => new bignumber_js_1.default(it.expireAt).toFixed());
                const preExpireAt = bignumber_js_1.default.max(...expireAtArrays, "1").toFixed();
                return stakingPool.fixedDeposit(amount, period, preExpireAt);
            }
            else {
                return stakingPool.currentDeposit(amount);
            }
        };
        stakingInfo.unStake = async (amount) => {
            amount = new bignumber_js_1.default(amount).multipliedBy(10 ** lpBalance.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            return stakingPool.withdraw(user, amount);
        };
        stakingInfo.claim = async () => {
            return stakingPool.claimReward(user);
        };
        return stakingInfo;
    }
};
StakingService = __decorate([
    (0, tool_1.CacheKey)("StakingService"),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], StakingService);
exports.StakingService = StakingService;
