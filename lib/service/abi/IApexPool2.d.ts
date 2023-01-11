import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
import { TransactionEvent } from '../vo';
export declare class IApexPool2 extends BaseService {
    apexPoolInstance: MulContract;
    apexPoolContract: Contract;
    constructor(connectInfo: ConnectInfo);
    stakeAPEX(amount: string): Promise<TransactionEvent>;
    stakeEsAPEX(amount: string): Promise<TransactionEvent>;
    unstakeAPEX(to: string, amount: string): Promise<TransactionEvent>;
    unstakeEsAPEX(to: string, amount: string): Promise<TransactionEvent>;
}
