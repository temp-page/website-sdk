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
     */
    static APY(totalRewardsLastWeek, totalStakeLastWeek, apexPrice) {
        // 池子APY=上周总奖励*365/(上周总Stake数量*APEX价格*7)
        let apy = '0';
        if (new bignumber_js_1.default(totalStakeLastWeek).comparedTo(0) > 0) {
            apy = new bignumber_js_1.default(totalRewardsLastWeek)
                .multipliedBy(365)
                .div(new bignumber_js_1.default(totalStakeLastWeek).multipliedBy(apexPrice).multipliedBy(7))
                .multipliedBy('100') // 百分比
                .toFixed();
        }
        return {
            apy,
        };
    }
}
exports.ApexPoolMathTool = ApexPoolMathTool;
