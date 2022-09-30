import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
import { TransactionEvent } from '../vo';
export declare class IBananaClaimable extends BaseService {
    bananaClaimableInstance: MulContract;
    bananaClaimableContract: Contract;
    constructor(connectInfo: ConnectInfo);
    claim(user: string, useFor: string, amount: string, expireAt: string, nonce: string, signature: string): Promise<TransactionEvent>;
}
