export declare class ApexPoolMathTool {
    /**
     * 计算APY
     * @param totalRewardsLastWeek 上周总奖励 USD
     * @param totalStakeLastWeek 上周质押 apex + esAPex
     * @param apexPrice APEX 价格 USD
     */
    static APY(totalRewardsLastWeek: string, totalStakeLastWeek: string, apexPrice: string): {
        apy: string;
    };
    /**
     * 计算 totalFactor
     */
    static totalFactor(t2eFactor: string, timeFactor: string): {
        totalFactor: string;
    };
}
