import { AddressInfo, ApexPoolService, BonusMantleService, BonusService, Erc20Service, MultiCallContract, RequestService, StakingService, TradeMiningService, TradeMiningV2Service, TransactionService } from './service';
import { providers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { AirdropService } from './service/AirdropService';
import { WalletConnect } from './WalletConnect';
export type Newable<T extends object> = new (...args: any[]) => T;
export declare class ConnectInfo {
    private _provider;
    private _wallet;
    private _status;
    private _msg;
    private _account;
    private _chainId;
    connectMethod: 'RPC' | 'WEB3' | 'EXT';
    walletConnect: WalletConnect;
    private _addressInfo;
    private _instanceCache;
    create<T extends object>(clazz: Newable<T>, ...args: any[]): T;
    clear(): void;
    /**
     * 获取 ERC20 API
     */
    erc20(): Erc20Service;
    /**
     * 获取交易API
     */
    tx(): TransactionService;
    tradeMining(): TradeMiningService;
    tradeMiningV2(): TradeMiningV2Service;
    bonus(): BonusService;
    bonusMantle(): BonusMantleService;
    apexPool(): ApexPoolService;
    airdrop(): AirdropService;
    staking(): StakingService;
    /**
     * request service
     */
    api(): RequestService;
    /**
     * multiCall service
     */
    multiCall(): MultiCallContract;
    get provider(): providers.JsonRpcProvider;
    set provider(value: providers.JsonRpcProvider);
    /**
     * 获取连接的状态
     */
    get status(): boolean;
    set status(value: boolean);
    /**
     * 获取连接的消息
     */
    get msg(): string;
    set msg(value: string);
    /**
     * 获取连接的地址
     */
    get account(): string;
    set account(value: string);
    /**
     * 获取连接的网络ID
     */
    get chainId(): number;
    set chainId(value: number);
    /**
     * 获取连接的地址信息
     */
    get addressInfo(): AddressInfo;
    set addressInfo(value: AddressInfo);
    set wallet(value: Signer);
    getWalletOrProvider(): Signer | Provider;
    getScan(): string;
    isArbi(): boolean;
    isMantle(): boolean;
    addToken(tokenAddress: any): Promise<boolean>;
}
