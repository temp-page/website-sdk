import { ConnectInfo } from "../../ConnectInfo";
import { RequestService } from "../RequestService";
export interface DragonBallAddressConfig {
    DragonBallConfig: string;
    DivineDragoNft: string;
    DragonBall: string;
    DragonBallNfts: string[];
}
/**
 * 地址信息
 */
export declare class AddressInfo {
    env: string;
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
    bananaBurnFrom: string;
    bananaUsdtPair: string;
    pair: string;
    twammRouter: string;
    buybackPool: string;
    stakingPool: string;
    arbRpc: string;
    arbiChainId: number;
    arbiApex: string;
    arbiApexPool: string;
    arbiMulticall: string;
    arbiBananaGraphApi: string;
    arbiDragonNftGraphApi: string;
    arbiScan: string;
    arbiAddressList: string[];
    apiService: RequestService;
    dragonBall: DragonBallAddressConfig;
    readonlyConnectInfoInstance: ConnectInfo;
    readonlyConnectInfo(): ConnectInfo;
    arbiReadonlyConnectInfoInstance: ConnectInfo;
    arbiReadonlyConnectInfo(): ConnectInfo;
    getApiService(): RequestService;
    getEtherscanAddress(address: string): string;
    getEtherscanTx(tx: string): string;
    getArbiScanTx(tx: string): string;
}
