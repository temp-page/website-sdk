import { ConnectInfo } from '../../ConnectInfo';
import { RequestService } from '../RequestService';
export interface DragonBallAddressConfig {
    DragonBallConfig: string;
    DivineDragoNft: string;
    DragonBall: string;
    DragonBallNfts: string[];
}
export interface ApexRegularStakingConfig {
    common: {
        apex: string;
        esApex: string;
        apexPoolV2: string;
        apexPoolV3: string;
        graphUrlV2: string;
        graphUrlV3: string;
    };
    arbi: {
        apex: string;
        esApex: string;
        apexPoolV2: string;
        apexPoolV3: string;
        graphUrlV2: string;
        graphUrlV3: string;
    };
    mantle: {
        apex: string;
        esApex: string;
        apexPoolV3: string;
        graphUrlV3: string;
    };
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
    apexClaimable: string;
    arbRpc: string;
    arbiChainId: number;
    arbiApex: string;
    arbiApexPool: string;
    arbiMulticall: string;
    arbiBananaGraphApi: string;
    arbiDragonNftGraphApi: string;
    arbiScan: string;
    mantleEsApex: string;
    mantleRpc: string;
    mantleChainId: number;
    mantleMulticall: string;
    mantleScan: string;
    arbiAddressList: string[];
    mantleAddressList: string[];
    apiService: RequestService;
    dragonBall: DragonBallAddressConfig;
    apexRegularStaking: ApexRegularStakingConfig;
    private readonlyConnectMap;
    private getChainConnectInfo;
    readonlyConnectInfo(): ConnectInfo;
    arbiReadonlyConnectInfo(): ConnectInfo;
    mantleReadonlyConnectInfo(): ConnectInfo;
    getApiService(): RequestService;
    getEtherscanAddress(address: string): string;
    getEtherscanTx(tx: string): string;
    getArbiScanTx(tx: string): string;
    getScanTxUrl(chainId: number, tx: string): string;
}
