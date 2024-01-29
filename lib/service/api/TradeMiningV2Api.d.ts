import { BaseApi } from "./BaseApi";
import { TradeMiningTotalGains, TradeMiningV2ActionsHistory, TradeMiningV2BurnHistory } from "../vo";
/**
 * Bond API
 */
export declare class TradeMiningV2Api {
    baseApi: BaseApi;
    constructor();
    getBananaPrice(): Promise<{
        price: string;
    }>;
    getActionsHistory(user: string, actions?: string[]): Promise<{
        totalGains: TradeMiningTotalGains;
        history: TradeMiningV2ActionsHistory[];
    }>;
    burnRecord(): Promise<TradeMiningV2BurnHistory[]>;
}
