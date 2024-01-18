import { BaseApi } from "./BaseApi";
import { TradeMiningActionsHistory, TradeMiningBBP, TradeMiningTotalGains } from "../vo";
/**
 * Bond API
 */
export declare class TradeMiningApi {
    baseApi: BaseApi;
    constructor();
    getBananaPrice(): Promise<{
        price: string;
    }>;
    executeVirtualOrders(): Promise<{
        reserveA: string;
        reserveB: string;
        oldReserveA: string;
        oldReserveB: string;
        resLastVirtualOrderBlock: string;
        currentSalesRateA: string;
        currentSalesRateB: string;
        rewardFactorA: string;
        rewardFactorB: string;
        tokenB: string;
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
    }>;
    getActionsHistory(user: string, actions?: string[]): Promise<{
        totalGains: TradeMiningTotalGains;
        history: TradeMiningActionsHistory[];
    }>;
    getBBP(user: string): Promise<TradeMiningBBP>;
    getRedeemRate(): Promise<{
        rate: string;
        timestamp: string;
    }[]>;
}
