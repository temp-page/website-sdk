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
    /**
     * LP TOKEN 余额
     */
    lpTokenBalance: string;
    /**
     * LP -> USDC
     */
    pooledUsdc: string;
    /**
     * LP -> Banana
     */
    pooledBanana: string;
    /**
     * LP 占比 （%）
     */
    shareOfPool: string;
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
    usdcBananaRate: string;
    bananaUsdcRate: string;
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
    bananaBurns: string;
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
     * "out" | 'in'  transfer
     */
    action: 'claim' | 'buy' | 'sell' | 'out' | 'in' | 'redeem' | 'addLp' | 'removeLp' | 'staking' | 'unstaking' | 'claimStakingReward';
    banana: string;
    lpToken: string;
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
    expireAt: string;
    locking: boolean;
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
/**
 * BBP
 */
export declare class TradeMiningBBP {
    totalSpent: string;
    currentRate: string;
    currentPrice: string;
    currentRedeemPrice: string;
    bananaBalance: string;
    /**
     * 折线图 - 52周所有的 *
     */
    dataTable: {
        burnVol: string;
        redeemRate: string;
        time: string;
    }[];
    /**
     * 折线图 - 52周所有的 *
     */
    allDataTable: {
        burnVol: string;
        redeemRate: string;
        time: string;
    }[];
    /**
     * 折线图 - 一天 *
     */
    dayDataTable: {
        burnVol: string;
        redeemRate: string;
        time: string;
    }[];
    /**
     * 折线图 - 1周 *
     */
    weekDataTable: {
        burnVol: string;
        redeemRate: string;
        time: string;
    }[];
    /**
     * 折线图 - 一月 *
     */
    monthDataTable: {
        burnVol: string;
        redeemRate: string;
        time: string;
    }[];
    /**
     * records
     */
    records: {
        amount: string;
        bootUp: string;
        burn: string;
        time: string;
        /**
         * HASH
         */
        tx: string;
        /**
         * HASH 链接
         */
        txLink: string;
    }[];
}
/**
 * Redeem
 */
export declare class TradeMiningRedeem {
    /**
     * APEX/BANANA 汇率
     */
    apexRate: string;
    /**
     * 开始redeemTime 的时间*
     */
    redeemTime: string;
    /**
     * 当前时间 *
     */
    currentTime: string;
    /**
     * 是否可以redeem*
     */
    canRedeem(): boolean;
    /**
     * BANANA 余额
     */
    bananaBalance: string;
    /**
     * redeem上链
     */
    redeem: (amount: string) => Promise<TransactionEvent>;
    /**
     * 输入banana 计算apex收益
     */
    calcApexReward: (amount: string) => Promise<string>;
}
/**
 * Liquidity
 */
export declare class TradeMiningLiquidity {
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
    /**
     *  LP 余额
     */
    lpBalance: string;
    showLpApprove: boolean;
    /**
     * 当前价格
     */
    currentPrice: string;
    /**
     * 添加流动性调用
     */
    approveBanana: () => Promise<TransactionEvent>;
    /**
     * 添加流动性调用
     */
    approveUsdc: () => Promise<TransactionEvent>;
    /**
     * 移除流动性调用
     */
    approveLp: () => Promise<TransactionEvent>;
    /**
     * 添加流动性回显
     *
     */
    preAddLiquidity: (inputToken: 'banana' | 'usdc', inputTokenAmount: string) => Promise<{
        banana: string;
        usdc: string;
        lpToken: string;
        shareOfPool: string;
        bananaPrice: string;
    }>;
    /**
     * 添加流动性上链
     */
    addLiquidity: (lpTokenAmount: string, deadline: string) => Promise<TransactionEvent>;
    /**
     * 移除流动性回显
     */
    preRemoveLiquidity: (lpTokenAmount: string) => Promise<{
        banana: string;
        usdc: string;
        lpToken: string;
        shareOfPool: string;
        bananaPrice: string;
    }>;
    /**
     * 移除流动性上链
     */
    removeLiquidity: (lpTokenAmount: string, deadline: string) => Promise<TransactionEvent>;
}
