/**
 * 交易挖矿.奖池
 */
import { TransactionEvent } from '../TransactionEvent';
import { Kline } from '../Kline';
export declare class TradeMiningPrizePool {
    /**
     * 可用余额
     */
    availableBalance: string;
    /**
     * Redeem Rate
     */
    redeemRate: string;
    /**
     * Price
     */
    price: string;
}
/**
 * 交易挖矿.奖池
 */
export declare class TradeMiningPreSwapInfo {
    inputToken: 'banana' | 'usdc';
    outToken: 'banana' | 'usdc';
    /**
     * 输入的金额
     */
    inputTokenAmount: string;
    /**
     * 输出的金额
     */
    outTokenAmount: string;
    /**
     * 价格影响 %
     */
    impact: string;
    price: string;
    swap: () => Promise<TransactionEvent>;
}
/**
 * 交易挖矿.swap.余额
 */
export declare class TradeMiningSwapBalance {
    /**
     * BANANA 余额
     */
    bananaBalance: string;
    showBananaApprove: boolean;
    /**
     *  usdc 余额
     */
    usdcBalance: string;
    showUsdcApprove: boolean;
    totalSpent: string;
    currentRate: string;
    currentPrice: string;
    boostUpRate: string;
    kline: Kline[];
    approveBanana: () => Promise<TransactionEvent>;
    approveUsdc: () => Promise<TransactionEvent>;
}
/**
 * 交易挖矿.swap.历史记录
 */
export declare class TradeMiningActionsHistory {
    /**
     * 操作
     * "buy" |"sell" Swap
     * "out" | 'in'  Transfer
     */
    action: 'claim' | 'buy' | 'sell' | 'out' | 'in' | 'redeem';
    banana: string;
    usdc: string;
    apex: string;
    timestamp: string;
    /**
     * hash
     */
    hash: string;
    /**
     * HASH地址
     */
    hashLink: string;
}
/**
 * 交易挖矿.swap.历史记录汇总
 */
export declare class TradeMiningTotalGains {
    /**
     * 总claimed (BANANA)
     */
    totalClaimed: string;
    /**
     * 总Swape (USDC)
     */
    totalSwaped: string;
    /**
     * 总Redeemed (APEX)
     */
    totalRedeemed: string;
}
