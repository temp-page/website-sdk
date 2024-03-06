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
exports.BonusService = void 0;
const BaseService_1 = require("./BaseService");
const ConnectInfo_1 = require("../ConnectInfo");
const tool_1 = require("./tool");
const vo_1 = require("./vo");
const EsAPEX_1 = require("./abi/EsAPEX");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
/**
 * Bonus API
 */
let BonusService = class BonusService extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    async esApexInfo() {
        const user = this.connectInfo.account;
        const esAPEX = this.connectInfo.create(EsAPEX_1.EsAPEX);
        const [exApexInfo, { blockTime }] = await this.connectInfo.multiCall().call({
            balance: esAPEX.esApexInstance.balanceOf(user),
            decimals: esAPEX.esApexInstance.decimals(),
            vestTime: esAPEX.esApexInstance.vestTime(),
            vestInfosLength: esAPEX.esApexInstance.getVestInfosLength(user),
            forceWithdrawMinRemainRatio: esAPEX.esApexInstance.forceWithdrawMinRemainRatio(),
        }, {
            blockTime: this.connectInfo.multiCall().multicall2Instance.getCurrentBlockTimestamp(),
        });
        const [{ vestInfos }] = await this.connectInfo.multiCall().call({
            vestInfos: esAPEX.esApexInstance.getVestInfosByPage(user, 0, exApexInfo.vestInfosLength),
        });
        const bonusEsApex = new vo_1.BonusEsApex();
        bonusEsApex.availableBalance = new bignumber_js_1.default(exApexInfo.balance).div(10 ** exApexInfo.decimals).toFixed();
        bonusEsApex.vestInfos = this.getBonusEsApexVestInfo(vestInfos, exApexInfo, blockTime);
        bonusEsApex.withdrawnVestInfos = bonusEsApex.vestInfos.filter((it) => !it.forceWithdrawn && new bignumber_js_1.default(it.unlocked).comparedTo('0') > 0);
        bonusEsApex.forceWithdrawnVestInfos = bonusEsApex.vestInfos.filter((it) => !it.forceWithdrawn);
        bonusEsApex.looking = bonusEsApex.vestInfos
            .map((it) => it.looking)
            .reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0');
        bonusEsApex.unlocked = bonusEsApex.vestInfos
            .map((it) => it.unlocked)
            .reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), '0');
        // 函数初始化
        bonusEsApex.vestInfo = async (amount) => {
            return {
                vestingPeroid: exApexInfo.vestTime,
                youWillReceive: amount,
                expireDate: new bignumber_js_1.default(blockTime).plus(exApexInfo.vestTime).toNumber(),
            };
        };
        // vest
        bonusEsApex.vest = async (amount) => {
            const vestAmount = new bignumber_js_1.default(amount).multipliedBy(10 ** exApexInfo.decimals).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            return esAPEX.vest(vestAmount);
        };
        // 普通提现
        bonusEsApex.withdrawal = (infos) => {
            infos = infos.filter((it) => new bignumber_js_1.default(it.unlocked).comparedTo('0') > 0);
            const vestIds = infos.map((it) => it.vestId);
            const withdrawAmounts = infos.map((it) => new bignumber_js_1.default(it.unlocked).multipliedBy(1e18).toFixed(0, bignumber_js_1.default.ROUND_DOWN));
            return esAPEX.batchWithdraw(user, vestIds, withdrawAmounts);
        };
        // 强制提现
        bonusEsApex.forceWithdrawal = (infos) => {
            const vestIds = infos
                .filter((it) => new bignumber_js_1.default(it.forcedWithdrawal.withdrawable).comparedTo('0') > 0)
                .map((it) => it.vestId);
            return esAPEX.batchForceWithdraw(user, vestIds);
        };
        return bonusEsApex;
    }
    getBonusEsApexVestInfo(vestInfos, exApexInfo, blockTime) {
        return vestInfos.map((it, index) => {
            const vestInfo = new vo_1.BonusEsApexVestInfo();
            vestInfo.vestId = Number(index).toString();
            vestInfo.esApexAmount = new bignumber_js_1.default(it.vestAmount).div(10 ** exApexInfo.decimals).toFixed();
            // 已解锁的
            vestInfo.released = new bignumber_js_1.default(it.claimedAmount).div(1e18).toFixed();
            // 可以withdraw的
            const { claimable } = tool_1.VestMathTool.getClaimable(blockTime, it);
            vestInfo.unlocked = new bignumber_js_1.default(claimable).div(1e18).toFixed();
            const { locking } = tool_1.VestMathTool.getLocking(blockTime, it);
            vestInfo.looking = new bignumber_js_1.default(locking).div(1e18).toFixed();
            const forceWithdrawable = tool_1.VestMathTool.getForceWithdrawable(exApexInfo.forceWithdrawMinRemainRatio, exApexInfo.vestTime, blockTime, it);
            vestInfo.forcedWithdrawal = {
                withdrawable: new bignumber_js_1.default(forceWithdrawable.withdrawable).div(1e18).toFixed(),
                penalty: new bignumber_js_1.default(forceWithdrawable.penalty).div(1e18).toFixed(),
            };
            vestInfo.forceWithdrawn = it.forceWithdrawn;
            vestInfo.startTime = new bignumber_js_1.default(it.startTime).toNumber();
            vestInfo.endTime = new bignumber_js_1.default(it.endTime).toNumber();
            if (vestInfo.forceWithdrawn || new bignumber_js_1.default(vestInfo.released).comparedTo(vestInfo.esApexAmount) === 0) {
                vestInfo.actions = 'over';
            }
            else {
                vestInfo.actions = 'withdraw';
            }
            return vestInfo;
        });
    }
};
BonusService = __decorate([
    (0, tool_1.CacheKey)('BonusService'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], BonusService);
exports.BonusService = BonusService;
