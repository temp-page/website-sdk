import { ConnectInfo } from '../../ConnectInfo';
import { TransactionEvent } from "./TransactionEvent";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
export interface Config {
    gasPrice?: string;
    gasLimit?: number;
    from?: string;
    value?: number | string;
    to?: string;
}
export declare class ExtTransactionEvent extends TransactionEvent {
    private _data;
    private _config;
    constructor(connectInfo: ConnectInfo, data: string, config: Config);
    get data(): string;
    get config(): Config;
    confirm(): Promise<TransactionReceipt>;
}
