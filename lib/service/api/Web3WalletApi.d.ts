import { BaseApi } from './BaseApi';
import { ConnectInfo } from '../../ConnectInfo';
export declare class Web3WalletApi {
    baseApi: BaseApi;
    baseUrl: string;
    riskToken: string;
    token: string;
    chainCode: string;
    constructor(baseUrl: string, token: string, riskToken?: string);
    request(path: string, method: 'get' | 'post' | 'put' | 'delete', data: any, config?: any): Promise<any>;
    gasPrice(): Promise<{
        slowGasPrice: {
            gasPrice: string;
            avgTime: string;
        };
        middleGasPrice: {
            gasPrice: string;
            avgTime: string;
        };
        fastGasPrice: {
            gasPrice: string;
            avgTime: string;
        };
        suggestBaseFee: string;
    }>;
    estimate(connectInfo: ConnectInfo, toAddress: string, data: string, config: {
        maxPriceFee?: number;
        gasPriorityFee?: number;
        value?: number | string;
    }): Promise<string>;
    sign(connectInfo: ConnectInfo, toAddress: string, data: string, config: {
        gasLimit?: string;
        maxPriceFee?: number;
        gasPriorityFee?: number;
        value?: number | string;
    }): Promise<string>;
    result(txnId: any): Promise<{
        status: number;
        txHash: string;
    }>;
}
