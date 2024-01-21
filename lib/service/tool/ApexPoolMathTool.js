"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApexPoolMathTool = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class ApexPoolMathTool {
    /**
     * 计算APY
     * @param totalRewardsLastWeek 上周总奖励 USD
     * @param totalStakeLastWeek 上周质押 apex + esAPex
     * @param apexPrice APEX 价格 USD
     * @param stakeDay 质押天数
     */
    static APY(totalRewardsLastWeek, totalStakeLastWeek, apexPrice, stakeDay = '7') {
        // 池子APY=上周总奖励*365/(上周总Stake数量*APEX价格*7)
        let apy = '0';
        if (new bignumber_js_1.default(totalStakeLastWeek).comparedTo(0) > 0 &&
            new bignumber_js_1.default(apexPrice).comparedTo('0') > 0 &&
            new bignumber_js_1.default(stakeDay).comparedTo('0') > 0) {
            apy = new bignumber_js_1.default(totalRewardsLastWeek)
                .multipliedBy(365)
                .div(new bignumber_js_1.default(totalStakeLastWeek).multipliedBy(apexPrice).multipliedBy(stakeDay))
                .multipliedBy('100') // 百分比
                .toFixed();
        }
        return {
            apy,
        };
    }
    /**
     * 计算 totalFactor
     */
    static totalFactor(tradingActivityFactor, timeFactor) {
        const totalFactor = new bignumber_js_1.default('1').plus(tradingActivityFactor).plus(timeFactor).toFixed();
        return {
            totalFactor,
        };
    }
    static avgStakeTime(apexStakeInfo, esApexStakeInfo) {
        const weightTimeStakeAmount = new bignumber_js_1.default(apexStakeInfo.lastUserStakeAmount)
            .multipliedBy(apexStakeInfo.avgStakeTime)
            .plus(new bignumber_js_1.default(esApexStakeInfo.lastUserStakeAmount).multipliedBy(esApexStakeInfo.avgStakeTime))
            .toFixed();
        const totalStakeAmount = new bignumber_js_1.default(apexStakeInfo.lastUserStakeAmount)
            .plus(esApexStakeInfo.lastUserStakeAmount)
            .toFixed();
        if (totalStakeAmount === '0') {
            return {
                avgStakeTime: '0',
            };
        }
        const avgStakeTime = new bignumber_js_1.default(weightTimeStakeAmount).div(totalStakeAmount).toFixed();
        return {
            avgStakeTime,
        };
    }
}
exports.ApexPoolMathTool = ApexPoolMathTool;
