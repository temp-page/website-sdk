/**
 * MerkleTree 活动
 */
import { TransactionEvent } from "../TransactionEvent";
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
    claim: () => Promise<TransactionEvent>;
}
