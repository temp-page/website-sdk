import { TransactionEvent } from '../TransactionEvent';
export declare class StakingInfo {
    /**
     * 可用Stake的余额
     */
    balance: string;
    /**
     * 是否需要授权
     */
    showApprove: boolean;
    /**
     * 可以UnStake的余额
     */
    unlockBalance: string;
    lockBalance: string;
    lockRecords: StakingRecord[];
    /**
     * APY
     */
    apy: string;
    /**
     * TVL
     */
    tvl: string;
    /**
     * USER APY
     */
    userAPY: string;
    /**
     * User Earned BANA
     */
    userEarnedBANA: string;
    /**
     * User LP Value
     */
    userLPValue: string;
    /**
     * 定期最大的天
     */
    maxDay: string;
    approve: () => Promise<TransactionEvent>;
    stake: (amount: string, period: string) => Promise<TransactionEvent>;
    preStake: (amount: string, period: string) => Promise<{
        estimatedAPR: string;
        unlockOn: string;
        stakeLPValue: string;
    }>;
    unStake: (amount: string) => Promise<TransactionEvent>;
    claim: () => Promise<TransactionEvent>;
}
export declare class StakingRecord {
    stakeTime: string;
    amount: string;
    unLockOn: string;
}
