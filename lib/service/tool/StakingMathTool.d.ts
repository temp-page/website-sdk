export declare class StakingMathTool {
    static tvl(lpTokenValue: string, lpTotalSupply: string, usdcReserves: string): {
        tvl: string;
    };
    static estimatedAPR(rewardsPerSecond: string, price: string, userTvl: string, userShare: string, totalShares: string): {
        apr: string;
    };
    static maxDay(endTime: string, blockTime: string): {
        day: string;
    };
}
