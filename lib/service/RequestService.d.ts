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
    apexPoolAPY(): Promise<{
        apy: string;
        totalApexStake: string;
        totalEsApexStake: string;
        lastWeekTotalStakingReward: string;
    }>;
    apexPoolStakeInfo(address: string, privateApi: any): Promise<{
        lastWeekTotalStakingReward: string;
        lastWeekTotalStake: string;
        totalAvgStakeTime: string;
        lastWeekUserReward: string;
        totalApexStake: string;
        totalEsApexStake: string;
        apexStake: {
            lastTotalStakeAmount: string;
            lastUserStakeAmount: string;
            t2eFactor: string;
            timeFactor: string;
            totalFactor: string;
        };
        esApexStake: {
            lastTotalStakeAmount: string;
            lastUserStakeAmount: string;
            t2eFactor: string;
            timeFactor: string;
            totalFactor: string;
        };
        rewardList: {
            rewardId: string;
            amount: string;
            token: string;
            time: string | number;
            canClaim: boolean;
            appId: string;
        }[];
        round: number;
        avgStakeTime: string;
        stakingHoldingsList: {
            round: number;
            stakeId: string;
            stakeToken: string;
            stakeAmount: string;
            totalFactor: string;
            t2EFactor: string;
            timeFactor: string;
            stakeDuration: string;
            updateTime: number;
        }[];
    }>;
}
export { RequestService };
