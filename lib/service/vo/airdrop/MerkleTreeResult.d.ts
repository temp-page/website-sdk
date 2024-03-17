/**
 * MerkleTree 活动
 */
import { TransactionEvent } from '../TransactionEvent';
export declare class MerkleTreeResult {
    /**
     * 是否领取 (优先级低)
     */
    isClaim: boolean;
    /**
     * 是否存在记录 (优先级高)
     */
    isExist: boolean;
    /**
     *  显示金额
     */
    showAmount: string;
    /**
     * USD Price*
     */
    usdPrice: string;
    /**
     * totalUsd*
     */
    totalUsd: string;
    isJoined: boolean;
    claim_end_time: number;
    stat_end_time: number;
    claim_start_time: number;
    trader_pools: any[];
    kol_pools: any[];
    claim: () => Promise<TransactionEvent>;
}
