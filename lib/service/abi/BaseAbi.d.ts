import type { ConnectInfo } from '../../ConnectInfo';
import type { AddressInfo } from '../vo';
import { MulContract } from '../../mulcall';
import { Fragment, JsonFragment } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
export declare class BaseAbi {
    protected provider: Provider;
    protected connectInfo: ConnectInfo;
    protected addressInfo: AddressInfo;
    mulContract: MulContract;
    contract: Contract;
    constructor(connectInfo: ConnectInfo, address: string, abi: JsonFragment[] | string[] | Fragment[]);
}
