import { ConnectInfo } from './ConnectInfo';
import { providers, Wallet } from 'ethers';
export declare class PrivateWallet {
    provider: providers.JsonRpcProvider;
    wallet: Wallet;
}
export declare class Web3Wallet {
    userToken: string;
    riskToken: string;
    baseUrl: string;
    address: string;
    safeCallBack: (result: any) => Promise<string>;
}
export declare type WalletType = Web3Wallet | PrivateWallet | providers.Web3Provider | {
    provider: any;
};
export declare type ChainName = 'Arbitrum' | 'Arbitrum Testnet' | 'rinkeby' | 'mainnet' | 'goerli';
export declare const getCurrentConnect: () => ConnectInfo;
export declare class WalletConnect {
    wallet: WalletType;
    connectInfo: ConnectInfo;
    constructor(walletName: WalletType);
    disConnect(): void;
    update(): void;
    privateWallet(): Promise<void>;
    web3Wallet(): Promise<void>;
    web3Provider(): Promise<void>;
    static connectMetaMask(ethereum: any): WalletConnect;
    /**
     * 链接钱包
     * @returns
     */
    connect(): Promise<ConnectInfo>;
}
