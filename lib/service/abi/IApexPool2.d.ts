import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
import { TransactionEvent } from '../vo';
export declare class IApexPool2 extends BaseService {
    apexPoolInstance: MulContract;
    apexPoolContract: Contract;
    constructor(connectInfo: ConnectInfo);
    stakeAPEX(accountId: string | number, amount: string): Promise<TransactionEvent>;
    stakeEsAPEX(accountId: string | number, amount: string): Promise<TransactionEvent>;
    unstakeAPEX(to: string, accountId: string | number, amount: string): Promise<TransactionEvent>;
    unstakeEsAPEX(to: string, accountId: string | number, amount: string): Promise<TransactionEvent>;
}
