"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeMiningRedeem = exports.TradeMiningBBP = exports.TradeMiningTotalGains = exports.TradeMiningActionsHistory = exports.TradeMiningSwapBalance = exports.TradeMiningPreSwapInfo = exports.TradeMiningPrizePool = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class TradeMiningPrizePool {
}
exports.TradeMiningPrizePool = TradeMiningPrizePool;
/**
 * 交易挖矿.奖池
 */
class TradeMiningPreSwapInfo {
}
exports.TradeMiningPreSwapInfo = TradeMiningPreSwapInfo;
/**
 * 交易挖矿.swap.余额
 */
class TradeMiningSwapBalance {
}
exports.TradeMiningSwapBalance = TradeMiningSwapBalance;
/**
 * 交易挖矿.swap.历史记录
 */
class TradeMiningActionsHistory {
}
exports.TradeMiningActionsHistory = TradeMiningActionsHistory;
/**
 * 交易挖矿.swap.历史记录汇总
 */
class TradeMiningTotalGains {
}
exports.TradeMiningTotalGains = TradeMiningTotalGains;
/**
 * BBP
 */
class TradeMiningBBP {
}
exports.TradeMiningBBP = TradeMiningBBP;
/**
 * Redeem
 */
class TradeMiningRedeem {
    /**
     * 是否可以redeem*
     */
    canRedeem() {
        return new bignumber_js_1.default(this.currentTime).comparedTo(this.redeemTime) > 0;
    }
}
exports.TradeMiningRedeem = TradeMiningRedeem;
