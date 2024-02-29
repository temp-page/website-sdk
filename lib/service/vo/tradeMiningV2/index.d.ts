import { TradeMiningRedeem } from "../tradeMining";
/**
 * 交易挖矿.swap.历史记录
 */
export declare class TradeMiningV2ActionsHistory {
    /**
     * 操作
     * "buy" |"sell" Swap
     * "out" | 'in'  transfer
     */
    action: 'claim' | 'buy' | 'sell' | 'out' | 'in' | 'redeem' | 'addLp' | 'removeLp';
    banana: string;
    lpToken: string;
    usdt: string;
    rate: string;
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
export interface TradeMiningV2BurnHistory {
    burn: string;
    time: string;
    /**
     * HASH
     */
    hash: string;
    /**
     * HASH 链接
     */
    txLink: string;
}
export declare class TradeMiningRedeemV2 extends TradeMiningRedeem {
    bananaPrice: string;
    bananaUsdt: string;
}
