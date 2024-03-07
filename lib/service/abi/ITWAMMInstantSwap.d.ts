import { BaseService } from '../BaseService';
import { ConnectInfo } from '../../ConnectInfo';
import { Contract } from 'ethers';
import { MulContract } from '../../mulcall';
import { TransactionEvent } from '../vo';
export declare class ITWAMMInstantSwap extends BaseService {
    TWAMMInstantSwapInstance: MulContract;
    TWAMMInstantSwapContract: Contract;
    constructor(connectInfo: ConnectInfo);
    instantSwapTokenToToken(token0: string, token1: string, amountIn: string, amountOutMin: string, deadline: string): Promise<TransactionEvent>;
    addLiquidity(token0: string, token1: string, lpTokenAmount: string, amountInOMax: string, amountIn1Max: string, deadline: string): Promise<TransactionEvent>;
    withdrawLiquidity(token0: string, token1: string, lpTokenAmount: string, amountOut0Min: string, amountOut1Min: string, deadline: string): Promise<TransactionEvent>;
}
