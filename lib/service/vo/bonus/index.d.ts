import { TransactionEvent } from '../TransactionEvent';
export declare class BonusEsApex {
    /**
     * 可用余额
     */
    availableBalance: string;
    /**
     * looking
     */
    looking: string;
    /**
     * 已释放未领取(APEX)
     */
    unlocked: string;
    vestInfos: BonusEsApexVestInfo[];
    withdrawnVestInfos: BonusEsApexVestInfo[];
    /**
     * vestInfo
     */
    vestInfo: (amount: string) => Promise<{
        vestingPeroid: string;
        youWillReceive: string;
        expireDate: number;
    }>;
    /**
     * vest
     */
    vest: (amount: string) => Promise<TransactionEvent>;
    /**
     * 普通提现
     */
    withdrawal: (vestInfos: BonusEsApexVestInfo[]) => Promise<TransactionEvent>;
    /**
     * 强制提现
     */
    forceWithdrawal: (vestIds: BonusEsApexVestInfo[]) => Promise<TransactionEvent>;
}
export declare class BonusEsApexVestInfo {
    /**
     * vestId
     */
    vestId: string;
    /**
     * esApex
     */
    esApexAmount: string;
    /**
     * 已释放已领取（APEX）
     */
    released: string;
    /**
     * 已释放未领取（APEX）
     */
    unlocked: string;
    /**
     * 待释放（APEX）
     */
    looking: string;
    /**
     * 强制提现 损失金额 (APEX)
     */
    forcedWithdrawal: {
        withdrawable: string;
        penalty: string;
    };
    /**
     * 是否已经强制提现了
     */
    forceWithdrawn: boolean;
    /**
     * Vest操作时间
     */
    startTime: number;
    /**
     * 到期时间
     */
    endTime: number;
    /**
     * 操作方式 over 结束 | withdraw 提现
     */
    actions: 'over' | 'withdraw';
}
