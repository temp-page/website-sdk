/**
 * MerkleTree 活动
 */
import { TransactionEvent } from "../TransactionEvent";
export declare class MerkleTreeResult {
    /**
     * 是否领取
     */
    isClaim: boolean;
    /**
     * 是否存在记录
     */
    isExist: boolean;
    /**
     *  显示金额
     */
    showAmount: string;
    claim: () => Promise<TransactionEvent>;
}
