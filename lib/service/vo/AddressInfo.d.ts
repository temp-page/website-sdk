import { ConnectInfo } from '../../ConnectInfo';
import { RequestService } from '../RequestService';
/**
 * 地址信息
 */
export declare class AddressInfo {
    graphApi: string;
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
    exApex: string;
    usdc: string;
    pair: string;
    twammRouter: string;
    buybackPool: string;
    backtrackingAirdrop: string;
    readonlyConnectInfoInstance: ConnectInfo;
    apiService: RequestService;
    readonlyConnectInfo(): ConnectInfo;
    getApiService(): RequestService;
    getEtherscanAddress(address: any): string;
    getEtherscanTx(tx: any): string;
}
