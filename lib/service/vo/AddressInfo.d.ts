import { ConnectInfo } from "../../ConnectInfo";
import { RequestService } from "../RequestService";
/**
 * 地址信息
 */
export declare class AddressInfo {
    apexProBaseUrl: string;
    bananaGraphApi: string;
    bananaV2GraphApi: string;
    /**
     * chainID
     */
    chainId: number;
    /**
     * 链上区块浏览器地址
     */
    scan: string;
    rpc: string;
    multicall: string;
    banana: string;
    bananaClaimable: string;
    apex: string;
    esApex: string;
    apexPool: string;
    usdc: string;
    usdt: string;
    bananaV2: string;
    apexV2: string;
    bananaClaimableV2: string;
    bananaUsdtPair: string;
    pair: string;
    twammRouter: string;
    buybackPool: string;
    stakingPool: string;
    arbiChainId: number;
    arbiApex: string;
    arbiApexPool: string;
    arbiMulticall: string;
    arbiBananaGraphApi: string;
    arbiScan: string;
    arbiAddressList: string[];
    readonlyConnectInfoInstance: ConnectInfo;
    apiService: RequestService;
    readonlyConnectInfo(): ConnectInfo;
    getApiService(): RequestService;
    getEtherscanAddress(address: string): string;
    getEtherscanTx(tx: string): string;
    getArbiScanTx(tx: string): string;
}
