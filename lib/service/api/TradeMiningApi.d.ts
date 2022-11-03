import { BaseApi } from './BaseApi';
import { Kline, TradeMiningActionsHistory, TradeMiningBBP, TradeMiningTotalGains } from '../vo';
/**
 * Bond API
 */
export declare class TradeMiningApi {
    baseApi: BaseApi;
    constructor(baseApi: BaseApi);
    getBananaPrice(): Promise<{
        price: string;
    }>;
    getBananaRate(): Promise<{
        rate: string;
        bananaPrice: string;
    }>;
    getBuyingRate(): Promise<string>;
    getSwapInfo(): Promise<{
        rate: string;
        bananaPrice: string;
        bananaBurns: string;
        totalSpents: string;
        boostUpRates: string;
        kline: Kline[];
    }>;
    getActionsHistory(user: string): Promise<{
        totalGains: TradeMiningTotalGains;
        history: TradeMiningActionsHistory[];
    }>;
    getBBP(user: string): Promise<TradeMiningBBP>;
}
