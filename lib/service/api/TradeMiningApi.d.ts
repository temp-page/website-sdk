import { BaseApi } from './BaseApi';
import { Kline, TradeMiningActionsHistory, TradeMiningTotalGains } from '../vo';
/**
 * Bond API
 */
export declare class TradeMiningApi {
    baseApi: BaseApi;
    constructor(baseApi: BaseApi);
    getBananaRate(): Promise<{
        rate: string;
        bananaPrice: string;
    }>;
    getSwapInfo(): Promise<{
        rate: string;
        bananaPrice: string;
        totalSpents: string;
        boostUpRates: string;
        kline: Kline[];
    }>;
    getActionsHistory(user: string): Promise<{
        totalGains: TradeMiningTotalGains;
        history: TradeMiningActionsHistory[];
    }>;
}
