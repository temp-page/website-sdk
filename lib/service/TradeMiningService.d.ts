import { BaseService } from "./BaseService";
import { ConnectInfo } from "../ConnectInfo";
import { TradeMiningPrizePool, TransactionEvent } from "./vo";
/**
 * Bond API
 */
export declare class TradeMiningService extends BaseService {
    constructor(connectInfo: ConnectInfo);
    prizePool(user?: string): Promise<TradeMiningPrizePool>;
    claim(user: string, useFor: string, amount: string, expireAt: string, nonce: string, signature: string): Promise<TransactionEvent>;
}
