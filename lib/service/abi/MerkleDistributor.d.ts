/// <reference types="node" />
import { BaseService } from "../BaseService";
import { ConnectInfo } from "../../ConnectInfo";
import { Contract } from "ethers";
import { MerkleTree } from "merkletreejs";
import { MulContract } from "../../mulcall";
import { MerkleTreeResult, TransactionEvent } from "../vo";
export declare class MerkleDistributor extends BaseService {
    merkleDistributorInstance: MulContract;
    merkleDistributorContract: Contract;
    constructor(connectInfo: ConnectInfo, address: string);
    claim(index: string, account: string, amount: string, merkleProof: string[]): Promise<TransactionEvent>;
    isClaimed(index: string): Promise<boolean>;
    /**
     * 初始化数据
     * @param user 用户
     * @param token 币
     * @param data account,amount
     */
    init(user: string, token: string, data: [number, string, string, string[]][]): Promise<MerkleTreeResult>;
}
/**
 * 余额Tree
 */
export declare class BalanceTree {
    tree: MerkleTree;
    constructor(balances: [number, string, string, string[]][]);
    toNode(index: string, account: string, amount: string): Buffer;
    getHexRoot(): string;
    getProof(index: string, account: string, amount: string): string[];
}
