import { TransactionEvent } from '../TransactionEvent';
export declare class ApexPoolStakeInfo {
    /**
     * APY %
     */
    apy: string;
    /**
     * USER APY %
     */
    userApy: string;
    /**
     * Total Stake Apex
     */
    totalStakeApex: string;
    /**
     * Total Stake EsApex
     */
    totalStakeEsApex: string;
    /**
     * Reward Last Period(USDC)
     */
    rewardLastPeriod: string;
    /**
     * Unclaim Rewards(USDC)
     */
    unclaimRewards: string;
    /**
     * Total Earned Reward(USDC)
     */
    totalEarnedReward: string;
    /**
     * User Staked APEX
     */
    userStakedAPEX: string;
    /**
     * User Staked esAPEX
     */
    userStakedEsAPEX: string;
    /**
     * 是否需要授权Apex
     */
    showApexApprove: boolean;
    /**
     * 是否需要授权EsApex
     */
    showEsApexApprove: boolean;
    /**
     * APEX的余额
     */
    apexBalance: string;
    /**
     * EsApex的余额
     */
    esApexBalance: string;
    approve: (token: 'apex' | 'esApex') => Promise<TransactionEvent>;
    stake: (token: 'apex' | 'esApex', amount: string) => Promise<TransactionEvent>;
    preStake: (token: 'apex' | 'esApex') => Promise<{
        t2eFactor: string;
        timeFactor: string;
        totalFactor: string;
    }>;
    unStake: (token: 'apex' | 'esApex', amount: string) => Promise<TransactionEvent>;
}
