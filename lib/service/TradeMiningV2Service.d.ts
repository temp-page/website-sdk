import { BaseService } from './BaseService';
import { ConnectInfo } from '../ConnectInfo';
import { TradeMiningRedeemV2, TransactionEvent } from './vo';
/**
 * Bond API
 */
export declare class TradeMiningV2Service extends BaseService {
    constructor(connectInfo: ConnectInfo);
    claim(user: string, useFor: string, accountId: string, amount: string, expireAt: string, nonce: string, signature: string): Promise<TransactionEvent>;
    claimApex(user: string, useFor: string, accountId: string, amount: string, expireAt: string, nonce: string, signature: string): Promise<TransactionEvent>;
    redeemInfo(): Promise<TradeMiningRedeemV2>;
}
