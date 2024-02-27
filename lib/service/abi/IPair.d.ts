import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
export declare class IPair extends BaseService {
    pairInstance: MulContract;
    pairContract: Contract;
    constructor(connectInfo: ConnectInfo);
}
