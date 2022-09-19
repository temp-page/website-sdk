import { BaseService } from "./BaseService";
import { ConnectInfo } from "../ConnectInfo";
import { MerkleTreeResult } from "./vo";
/**
 * 空投 业务实现
 */
export declare class AirdropService extends BaseService {
    constructor(connectInfo: ConnectInfo);
    /**
     * 交易大赛活动列表
     */
    backtrackingAirdrop(user?: string): Promise<MerkleTreeResult>;
}
