import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
import { TransactionEvent } from '../vo';
export declare class IApexPool3 extends BaseService {
    apexPoolInstance: MulContract;
    apexPoolContract: Contract;
    constructor(connectInfo: ConnectInfo);
    stakeAPEX(accountId: string | number, amount: string, lockPeriod: number | string): Promise<TransactionEvent>;
    stakeEsAPEX(accountId: string | number, amount: string, lockPeriod: number | string): Promise<TransactionEvent>;
    unstakeAPEX(stakeId: string): Promise<TransactionEvent>;
    unstakeEsAPEX(stakeId: string): Promise<TransactionEvent>;
    batchUnstakeAPEX(stakeIds: string[]): Promise<TransactionEvent>;
    batchUnstakeEsAPEX(stakeIds: string[]): Promise<TransactionEvent>;
}
