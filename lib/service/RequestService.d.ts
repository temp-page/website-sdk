import { BaseApi, TradeMiningApi } from './api';
/**
 * 请求基类 详细信息查看
 */
declare class RequestService {
    baseApi: BaseApi;
    constructor();
    tradeMiningApi(): TradeMiningApi;
    apexPrice(): Promise<{
        price: string;
    }>;
    apexPoolStakeInfo(accountId: string): Promise<{
        lastWeekTotalStakingReward: string;
        lastWeekTotalStake: string;
        lastWeekUserReward: string;
        totalApexStake: string;
        totalEsApexStake: string;
        t2eFactor: string;
        timeFactor: string;
        totalFactor: string;
        rewardList: {
            amount: string;
            token: string;
            time: string | number;
            canClaim: boolean;
        }[];
    }>;
}
export { RequestService };
