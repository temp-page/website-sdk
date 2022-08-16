import { ConnectInfo } from "../../ConnectInfo";
import { RequestService } from "../RequestService";
/**
 * 地址信息
 */
export declare class AddressInfo {
    graphApi: string;
    /**
     * chainID
     */
    chainId: number;
    env: 'dev' | 'beta' | 'staging' | 'prod';
    /**
     * 链上区块浏览器地址
     */
    scan: string;
    rpc: string;
    api: string;
    multicall: string;
    private readonlyConnectInfoInstance;
    private apiService;
    readonlyConnectInfo(): ConnectInfo;
    getApiService(): RequestService;
}
