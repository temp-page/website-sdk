import { ConnectInfo } from '../ConnectInfo';
import { BaseService } from './BaseService';
import { StakingInfo } from './vo';
export declare class StakingService extends BaseService {
    constructor(connectInfo: ConnectInfo);
    stakingInfo(): Promise<StakingInfo>;
}
