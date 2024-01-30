"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingMathTool = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class StakingMathTool {
    static tvl(lpTokenValue, lpTotalSupply, usdcReserves) {
        const usdcValue = new bignumber_js_1.default(lpTokenValue)
            .multipliedBy(usdcReserves)
            .div(lpTotalSupply)
            .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        const usdcAmount = new bignumber_js_1.default(usdcValue).div(1e6).toFixed();
        const tvl = new bignumber_js_1.default(usdcAmount).multipliedBy(2).toFixed();
        return {
            tvl,
        };
    }
    static estimatedAPR(rewardsPerSecond, price, userTvl, userShare, totalShares) {
        const ONE_YEAR = 365 * 24 * 60 * 60;
        let apr = '0';
        if (new bignumber_js_1.default(userTvl).comparedTo(0) > 0) {
            apr = new bignumber_js_1.default(rewardsPerSecond)
                .div(1e18)
                .multipliedBy(ONE_YEAR)
                .multipliedBy(price)
                .multipliedBy(new bignumber_js_1.default(userShare).div(new bignumber_js_1.default(totalShares)))
                .div(userTvl)
                .multipliedBy('100') // 百分比
                .toFixed();
        }
        return {
            apr,
        };
    }
    static maxDay(endTime, blockTime) {
        let day = '0';
        // 结束时间必须大于当前时间
        if (new bignumber_js_1.default(endTime).comparedTo(blockTime) > 0) {
            day = new bignumber_js_1.default(endTime)
                .minus(blockTime)
                .div(60 * 60 * 24)
                .toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        }
        return {
            day,
        };
    }
}
exports.StakingMathTool = StakingMathTool;
