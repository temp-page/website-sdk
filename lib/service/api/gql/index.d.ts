export declare function getBananaApexRateLogs(): string;
export declare function getSwapInfo(): string;
export declare function getActionsHistory(): string;
export declare function getUserActionsHistory(): string;
export declare function getBBPData(): string;
export declare function getRedeemRate(): string;
export declare function getStakingInfo(): string;
export declare function getApexPoolStakeInfos(): string;
export declare function getUserApexPoolStakeInfos(): string;
export declare function getUserApexPoolStakeInfosV2(): string;
export declare function getActionsV2History(): string;
export declare function getBananaBurnRecord(from: string): string;
export declare function getDragonTransactions(user: string): string;
export interface DragonTransaction {
    transactions: {
        hash: string;
        timestamp: string;
        log: {
            user: string;
            action: string;
            star: string;
            tokenId: string;
        }[];
    }[];
}
export declare function getDragonTopUsers(): string;
export interface DragonTopUsers {
    userInfos: {
        id: string;
        score: string;
        totalStar: string;
        dragon: string;
    }[];
}
export declare function getApexPoolV2Logs(): string;
export declare function getApexPoolV3Logs(): string;
export interface ApexPoolV3Logs {
    stakeLogs: ApexPoolStakeLogs[];
}
export interface ApexPoolStakeLogs {
    id: string;
    action: string;
    accountId: string;
    user: string;
    hash: string;
    amount: string;
    block: string;
    token: string;
    tokenName: string;
    timestamp: string;
    stakeId: string | undefined;
    lockPeriod: string | undefined;
}
export declare function getApexPoolV3StakeInfo(): string;
export interface ApexPoolV3StakeInfos {
    stakeInfos: ApexPoolV3StakeInfo[];
}
export interface ApexPoolV3StakeInfo {
    id: string;
    stakeId: string;
    accountId: string;
    token: string;
    tokenName: string;
    amount: string;
    lockPeriod: string;
    stakeTime: string;
}
