import { TransactionEvent } from '../TransactionEvent';
export interface ApexPoolStakeInfoV2 {
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
     * Claim Rewards(USDC)
     */
    claimRewards: string;
    /**
     * Total Earned Reward(USDC)
     */
    totalEarnedReward: string;
    /**
     * User Total Staked APEX
     */
    userTotalStakedAPEX: string;
    /**
     * User Total Staked esAPEX
     */
    userTotalStakedEsAPEX: string;
    /**
     * Trading Activity Factor
     */
    tradingActivityFactor: string;
    /**
     * User Staked APEX
     */
    userStakedAPEX: string;
    /**
     * User Staked esAPEX
     */
    userStakedEsAPEX: string;
    /**
     * 用户定期可移除的质押Apex
     */
    userRegularCanUnStakeApex: string;
    /**
     * 用户定期可移除的质押EsApex
     */
    userRegularCanUnStakeEsApex: string;
    /**
     * APEX的余额
     */
    apexBalance: string;
    /**
     * EsApex的余额
     */
    esApexBalance: string;
    round: number;
    rewardList: {
        rewardId: string;
        amount: string;
        token: string;
        time: string | number;
        canClaim: boolean;
        appId: string;
    }[];
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
    checkApprove: (token: 'apex' | 'esApex', amount: string | number, lockPeriod: number | string) => boolean;
    approve: (token: 'apex' | 'esApex', lockPeriod: number | string) => Promise<TransactionEvent>;
    stake: (token: 'apex' | 'esApex', amount: string, lockPeriod: number | string) => Promise<TransactionEvent>;
    preStake: (token: 'apex' | 'esApex', lockPeriod: number | string) => Promise<{
        tradingActivityFactor: string;
        t2eFactor: string;
        timeFactor: string;
        newTimeFactor: string;
        totalFactor: string;
    }>;
    unStake: (token: 'apex' | 'esApex', amount: string) => Promise<TransactionEvent>;
    unStakeRegular: (token: 'apex' | 'esApex') => Promise<TransactionEvent>;
    unStakeRegularBtStakeId: (token: 'apex' | 'esApex', stakeId: string | number) => Promise<TransactionEvent>;
}
/**
 * 交易挖矿.swap.历史记录
 */
export interface ApexPoolActionsHistoryV2 {
    action: 'stakeApex' | 'unstakeApex' | 'stakeEsApex' | 'unstakeEsApex';
    apex: string;
    esApex: string;
    timestamp: string;
    lockPeriod: string | undefined;
    chain: 'arbitrum' | 'ethereum';
    /**
     * hash
     */
    hash: string;
    /**
     * HASH地址
     */
    hashLink: string;
}
