"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VestMathTool = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class VestMathTool {
    static getClaimable(blockTime, info) {
        let claimable = '0';
        if (!info.forceWithdrawn) {
            const pastTime = new bignumber_js_1.default(blockTime).minus(info.startTime);
            const wholeTime = new bignumber_js_1.default(info.endTime).minus(info.startTime);
            if (pastTime.comparedTo(wholeTime) >= 0) {
                claimable = new bignumber_js_1.default(info.vestAmount);
            }
            else {
                claimable = new bignumber_js_1.default(info.vestAmount).multipliedBy(pastTime).div(wholeTime).dp(0, bignumber_js_1.default.ROUND_DOWN);
            }
            claimable = claimable.minus(info.claimedAmount).toFixed();
        }
        return {
            claimable,
        };
    }
    static getLocking(blockTime, info) {
        let locking = '0';
        if (!info.forceWithdrawn) {
            if (new bignumber_js_1.default(blockTime).comparedTo(info.endTime) >= 0) {
                locking = 0;
            }
            else {
                const leftTime = new bignumber_js_1.default(info.endTime).minus(blockTime);
                const wholeTime = new bignumber_js_1.default(info.endTime).minus(info.startTime);
                locking = new bignumber_js_1.default(info.vestAmount).multipliedBy(leftTime).div(wholeTime).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
            }
        }
        return {
            locking,
        };
    }
    static getForceWithdrawable(forceWithdrawMinRemainRatio, vestTime, blockTime, info) {
        const { locking } = VestMathTool.getLocking(blockTime, info);
        let left = new bignumber_js_1.default(locking)
            .multipliedBy(new bignumber_js_1.default(forceWithdrawMinRemainRatio).plus(
        // (10000 - forceWithdrawMinRemainRatio) * (blockTime - startTime) / vestTime
        new bignumber_js_1.default(10000)
            .minus(forceWithdrawMinRemainRatio)
            .multipliedBy(new bignumber_js_1.default(blockTime).minus(info.startTime))
            .div(vestTime)
            .dp(0, bignumber_js_1.default.ROUND_DOWN)))
            .div(10000)
            .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        if (new bignumber_js_1.default(left).comparedTo(new bignumber_js_1.default(locking)) > 0) {
            left = locking;
        }
        const { claimable } = VestMathTool.getClaimable(blockTime, info);
        return {
            withdrawable: new bignumber_js_1.default(claimable).plus(left).toFixed(),
            penalty: new bignumber_js_1.default(locking).minus(left).toFixed(),
        };
    }
}
exports.VestMathTool = VestMathTool;
