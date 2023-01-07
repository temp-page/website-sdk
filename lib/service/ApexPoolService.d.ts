import { BaseService } from './BaseService';
import { ConnectInfo } from '../ConnectInfo';
import { ApexPoolStakeInfo } from './vo';
/**
 * Bonus API
 */
export declare class ApexPoolService extends BaseService {
    constructor(connectInfo: ConnectInfo);
    stakeInfo(accountId: string): Promise<ApexPoolStakeInfo>;
}
