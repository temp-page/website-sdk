import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
import { TransactionEvent } from '../vo';
export declare class IBananaV2 extends BaseService {
    bananaInstance: MulContract;
    bananaContract: Contract;
    constructor(connectInfo: ConnectInfo);
    redeem(amount: string): Promise<TransactionEvent>;
}
