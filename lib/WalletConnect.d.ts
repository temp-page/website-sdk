import { ConnectInfo } from "./ConnectInfo";
import { providers, Wallet } from "ethers";
export declare class PrivateWallet {
    provider: providers.JsonRpcProvider;
    wallet: Wallet;
}
export declare type WalletType = "walletconnect" | "metamask" | "mathwallet" | "bitkeep" | "rainbow" | "argent" | "trust" | "imtoken" | "pillar" | "tokenpocket" | PrivateWallet | providers.Web3Provider;
export declare type ChainName = "Arbitrum" | "Arbitrum Testnet" | "rinkeby" | "mainnet" | "goerli";
export declare class WalletConnect {
    wallet: WalletType;
    connectInfo: ConnectInfo;
    callback: (connectInfo: ConnectInfo) => void;
    constructor(walletName: WalletType, callback: (connectInfo: ConnectInfo) => void);
    disConnect(): void;
    update(): void;
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
