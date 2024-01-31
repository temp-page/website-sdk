import { BaseService } from './BaseService';
import { ConnectInfo } from '../ConnectInfo';
import { TradeMiningLiquidity, TradeMiningPreSwapInfo, TradeMiningPrizePool, TradeMiningRedeem, TradeMiningSwapBalance, TransactionEvent } from './vo';
/**
 * Bond API
 */
export declare class TradeMiningService extends BaseService {
    constructor(connectInfo: ConnectInfo);
    prizePool(): Promise<TradeMiningPrizePool>;
    claim(user: string, useFor: string, accountId: string, amount: string, expireAt: string, nonce: string, signature: string): Promise<TransactionEvent>;
    swapBalance(): Promise<TradeMiningSwapBalance>;
    swapInfo(token: 'banana' | 'usdc', amount: string, slippage: string, deadline: string): Promise<TradeMiningPreSwapInfo>;
    redeemInfo(): Promise<TradeMiningRedeem>;
    liquidityInfo(): Promise<TradeMiningLiquidity>;
}
