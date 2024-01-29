import { BaseApi, DragonApi, TradeMiningApi } from './api';
import { TradeMiningV2Api } from "./api/TradeMiningV2Api";
/**
 * 请求基类 详细信息查看
 */
declare class RequestService {
    baseApi: BaseApi;
    constructor();
    tradeMiningApi(): TradeMiningApi;
    tradeMiningV2Api(): TradeMiningV2Api;
    dragonApi(): DragonApi;
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
        tradingActivityFactor: string;
        totalApexStake: string;
        totalEsApexStake: string;
        userTotalApexStake: string;
        userTotalEsApexStake: string;
        apexStake: {
            lastTotalStakeAmount: string;
            lastUserStakeAmount: string;
            t2eFactor: string;
            tradingActivityFactor: string;
            timeFactor: string;
            totalFactor: string;
        };
        esApexStake: {
            lastTotalStakeAmount: string;
            lastUserStakeAmount: string;
            t2eFactor: string;
            tradingActivityFactor: string;
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
            tradingActivityFactor: string;
            timeFactor: string;
            stakeDuration: string;
            updateTime: number;
        }[];
    }>;
}
export { RequestService };
