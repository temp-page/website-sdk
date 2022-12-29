import { BaseService } from "../BaseService";
import { MulContract } from "../../mulcall";
import { Contract } from "ethers";
import { ConnectInfo } from "../../ConnectInfo";
import { TransactionEvent } from "../vo";
export declare class IStakingPool2 extends BaseService {
    StakingPoolInstance: MulContract;
    StakingPoolContract: Contract;
    constructor(connectInfo: ConnectInfo);
    currentDeposit(amount: string): Promise<TransactionEvent>;
    fixedDeposit(amount: string, period: string, preExpireAt: string): Promise<TransactionEvent>;
    withdraw(to: string, amount: string): Promise<TransactionEvent>;
    claimReward(to: string): Promise<TransactionEvent>;
}
