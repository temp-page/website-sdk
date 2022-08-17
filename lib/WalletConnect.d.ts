import { ConnectInfo } from "./ConnectInfo";
import { providers, Wallet } from "ethers";
export declare class PrivateWallet {
    provider: providers.JsonRpcProvider;
    wallet: Wallet;
}
export declare type WalletType = PrivateWallet | providers.Web3Provider;
export declare type ChainName = "Arbitrum" | "Arbitrum Testnet" | "rinkeby" | "mainnet" | "goerli";
export declare class WalletConnect {
    wallet: WalletType;
    connectInfo: ConnectInfo;
    constructor(walletName: WalletType);
    disConnect(): void;
    update(): void;
    privateWallet(): Promise<void>;
    web3Provider(): Promise<void>;
    /**
     * 链接钱包
     * @returns
     */
    connect(): Promise<ConnectInfo>;
}
