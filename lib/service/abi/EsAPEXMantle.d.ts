import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
import { TransactionEvent } from '../vo';
export declare class EsAPEXMantle extends BaseService {
    esApexInstance: MulContract;
    esApexContract: Contract;
    constructor(connectInfo: ConnectInfo);
    vest(amount: string): Promise<TransactionEvent>;
    batchWithdraw(to: string, vestIds: string[], amounts: string[]): Promise<TransactionEvent>;
    batchForceWithdraw(to: string, vestIds: string[]): Promise<TransactionEvent>;
}
