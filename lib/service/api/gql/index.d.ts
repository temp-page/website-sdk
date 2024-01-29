export declare function getBananaApexRateLogs(): string;
export declare function getSwapInfo(): string;
export declare function getActionsHistory(): string;
export declare function getUserActionsHistory(): string;
export declare function getBBPData(): string;
export declare function getRedeemRate(): string;
export declare function getStakingInfo(): string;
export declare function getApexPoolStakeInfos(): string;
export declare function getUserApexPoolStakeInfos(): string;
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
