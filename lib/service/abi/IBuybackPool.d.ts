import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { ContractCall, MulContract } from '../../mulcall';
import { Contract } from 'ethers';
export interface ShapeWithLabel {
    [item: string]: ContractCall | string;
}
export declare class IBuybackPool extends BaseService {
    buybackPoolInstance: MulContract;
    buybackPoolContract: Contract;
    constructor(connectInfo: ConnectInfo);
    lastBuyingRate(): Promise<string>;
}
