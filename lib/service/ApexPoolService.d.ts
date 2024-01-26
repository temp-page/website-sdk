import { BaseService } from './BaseService';
import { ConnectInfo } from '../ConnectInfo';
import { ApexPoolActionsHistory, ApexPoolStakeInfo } from './vo';
/**
 * Bonus API
 */
export declare class ApexPoolService extends BaseService {
    constructor(connectInfo: ConnectInfo);
    stakeInfo(accountId: string | number, privateApi: any): Promise<ApexPoolStakeInfo>;
    getActionsHistory(user: string, actions?: string[]): Promise<{
        historyRecords: ApexPoolActionsHistory[];
    }>;
}
