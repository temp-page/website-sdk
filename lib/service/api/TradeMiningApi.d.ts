import { BaseApi } from "./BaseApi";
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
}
