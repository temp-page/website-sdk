import { BaseApi } from "./BaseApi";
import { ApexPoolActionsHistoryV2, ApexPoolStakeInfoV2, ApexPoolV2StakingHolding } from "../vo";
import { ConnectInfo } from "../../ConnectInfo";
export declare class ApexPoolV2Api {
    baseApi: BaseApi;
    constructor();
    apexPoolAPY(): Promise<{
        apy: string;
        totalApexStake: string;
        totalEsApexStake: string;
        avgRegularTime: string;
        lastWeekTotalStakingReward: string;
    }>;
    apexPoolStakeInfo(address: string, privateApi: any): Promise<{
        lastWeekTotalStakingReward: string;
        lastWeekTotalStake: string;
        avgRegularTime: string;
        totalAvgStakeTime: string;
        lastWeekUserReward: string;
        tradingActivityFactor: string;
        totalApexStake: string;
        totalEsApexStake: string;
        userTotalApexStake: string;
        userTotalEsApexStake: string;
        userCurrentTotalApexStake: string;
        userCurrentTotalEsApexStake: string;
        userRegularTotalApexStake: string;
        userRegularTotalEsApexStake: string;
        userLockPeriodWeightedTime: string;
        apexStake: {
            lastTotalStakeAmount: string;
            lastUserStakeAmount: string;
            t2eFactor: string;
            tradingActivityFactor: string;
            timeFactor: string;
            newTimeFactor: string;
            totalFactor: string;
        };
        esApexStake: {
            lastTotalStakeAmount: string;
            lastUserStakeAmount: string;
            t2eFactor: string;
            tradingActivityFactor: string;
            timeFactor: string;
            newTimeFactor: string;
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
        stakingHoldingsList: ApexPoolV2StakingHolding[];
    }>;
    stakeInfo(accountId: string | number, privateApi: any, connectInfo: ConnectInfo): Promise<ApexPoolStakeInfoV2>;
    getActionsHistory(user: string, actions?: string[]): Promise<{
        historyRecords: ApexPoolActionsHistoryV2[];
    }>;
}
