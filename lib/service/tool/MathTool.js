"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathTool = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const Tool_1 = require("./Tool");
const BasicException_1 = require("../../BasicException");
// uni计算公式
//    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
//         require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');
//         require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
//         uint amountInWithFee = amountIn.mul(997);
//         uint numerator = amountInWithFee.mul(reserveOut);
//         uint denominator = reserveIn.mul(1000).add(amountInWithFee);
//         amountOut = numerator / denominator;
//     }
class MathTool {
    static getAmountOut(amountIn, reserveIn, reserveOut) {
        const amountInWithFee = new bignumber_js_1.default(amountIn).multipliedBy(997);
        const numerator = new bignumber_js_1.default(amountInWithFee).multipliedBy(reserveOut);
        const denominator = new bignumber_js_1.default(reserveIn).multipliedBy(1000).plus(amountInWithFee);
        const amountOut = numerator.div(denominator).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        Tool_1.Trace.debug('getAmountOut', amountIn, reserveIn, reserveOut, amountOut);
        return amountOut;
    }
    static impact(amountIn, amountOut, reserveIn, reserveOut) {
        const exactQuote = new bignumber_js_1.default(reserveOut).div(reserveIn).multipliedBy(amountIn).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        if (new bignumber_js_1.default(amountOut).comparedTo('0') <= 0 || new bignumber_js_1.default(exactQuote).comparedTo('0') <= 0) {
            return '0';
        }
        return new bignumber_js_1.default(exactQuote).minus(amountOut).div(exactQuote).abs().multipliedBy(100).toFixed();
    }
    static deadline(deadline) {
        return new bignumber_js_1.default(new Date().getTime()).div(1000).plus(deadline).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
    }
    static quote(amountA, reserveA, reserveB) {
        if (new bignumber_js_1.default(amountA).comparedTo('0') <= 0) {
            throw new BasicException_1.BasicException('UniswapV2Library: INSUFFICIENT_AMOUNT');
        }
        if (new bignumber_js_1.default(reserveA).comparedTo('0') <= 0 || new bignumber_js_1.default(reserveB).comparedTo('0') <= 0) {
            throw new BasicException_1.BasicException('UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        }
        return new bignumber_js_1.default(amountA).multipliedBy(reserveB).div(reserveA).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
    }
}
exports.MathTool = MathTool;
