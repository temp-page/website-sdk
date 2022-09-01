import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
export declare class IBanana extends BaseService {
    bananaInstance: MulContract;
    bananaContract: Contract;
    constructor(connectInfo: ConnectInfo);
}
