interface PoolStakeInfo {
    avgStakeTime: string;
    lastUserStakeAmount: string;
}
export declare class ApexPoolMathTool {
    /**
     * 计算APY
     * @param totalRewardsLastWeek 上周总奖励 USD
     * @param totalStakeLastWeek 上周质押 apex + esAPex
     * @param apexPrice APEX 价格 USD
     * @param stakeDay 质押天数
     */
    static APY(totalRewardsLastWeek: string, totalStakeLastWeek: string, apexPrice: string, stakeDay?: string): {
        apy: string;
    };
    /**
     * 计算 totalFactor
     */
    static totalFactor(tradingActivityFactor: string, timeFactor: string): {
        totalFactor: string;
    };
    static avgStakeTime(apexStakeInfo: PoolStakeInfo, esApexStakeInfo: PoolStakeInfo): {
        avgStakeTime: string;
    };
}
export {};
