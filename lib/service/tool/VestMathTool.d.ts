declare type VestInfo = {
    claimedAmount: string;
    startTime: string;
    endTime: string;
    vestAmount: string;
    forceWithdrawn: boolean;
};
export declare class VestMathTool {
    static getClaimable(blockTime: string, info: VestInfo): {
        claimable: string;
    };
    static getLocking(blockTime: string, info: VestInfo): {
        locking: string;
    };
    static getForceWithdrawable(forceWithdrawMinRemainRatio: string, vestTime: string, blockTime: string, info: VestInfo): {
        withdrawable: string;
        penalty: string;
    };
}
export {};
