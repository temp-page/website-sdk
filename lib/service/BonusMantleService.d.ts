import { BaseService } from './BaseService';
import { ConnectInfo } from '../ConnectInfo';
import { BonusEsApex } from './vo';
/**
 * Bonus API
 */
export declare class BonusMantleService extends BaseService {
    constructor(connectInfo: ConnectInfo);
    esApexInfo(): Promise<BonusEsApex>;
    private getBonusEsApexVestInfo;
}
