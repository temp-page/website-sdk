import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
export declare class IBananaUsdtPair extends BaseService {
    pairInstance: MulContract;
    pairContract: Contract;
    constructor(connectInfo: ConnectInfo);
}
