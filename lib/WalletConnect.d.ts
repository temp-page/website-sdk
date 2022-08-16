import { ConnectInfo } from './ConnectInfo';
import { providers, Wallet } from 'ethers';
export declare const rpcUrl: {
    1: string;
    42: string;
    4: string;
    56: string;
    256: string;
    128: string;
    97: string;
    66: string;
    65: string;
    80001: string;
    42161: string;
    137: string;
    10: string;
    250: string;
    421611: string;
};
export declare class PrivateWallet {
    provider: providers.JsonRpcProvider;
    wallet: Wallet;
}
export declare type WalletType = 'walletconnect' | 'metamask' | 'mathwallet' | 'bitkeep' | 'rainbow' | 'argent' | 'trust' | 'imtoken' | 'pillar' | 'tokenpocket' | PrivateWallet | providers.Web3Provider;
export declare type ChainName = 'Arbitrum' | 'Arbitrum Testnet' | 'rinkeby' | 'mainnet' | 'goerli';
export declare class WalletConnect {
    wallet: WalletType;
    connectInfo: ConnectInfo;
    callback: (connectInfo: ConnectInfo) => void;
    constructor(walletName: WalletType, callback: (connectInfo: ConnectInfo) => void);
    disConnect(): void;
    update(): void;
    walletconnect(): Promise<void>;
    metamask(): Promise<void>;
    privateWallet(): Promise<void>;
    web3Provider(): Promise<void>;
    /**
     * 链接钱包
     * @returns
     */
    connect(): Promise<void>;
    getEthereum(): any;
    /**
     * 一键切换链
     * @param chainName "Arbitrum" | "Arbitrum Testnet" | rinkeby | mainnet
     */
    switchChain(chainName: ChainName): void;
}
