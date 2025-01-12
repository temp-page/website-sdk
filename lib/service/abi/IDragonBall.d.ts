import { ConnectInfo } from "../../ConnectInfo";
import { BaseAbi } from "./BaseAbi";
import { TransactionEvent } from "../vo";
export interface DragonUser {
    user: string;
    divineDragoTokenId: string;
    token0: string;
    token1: string;
    token2: string;
    token3: string;
    token4: string;
    token5: string;
    token6: string;
}
export declare class IDragonBall extends BaseAbi {
    constructor(connectInfo: ConnectInfo);
    batchMint(star: string[], tokenId: string[], signature: string[]): Promise<TransactionEvent>;
    dragon(tokenIds: string[]): Promise<TransactionEvent>;
    checkMint(star: number, tokenId: number): Promise<boolean>;
    getDivineDragoLeaderboardByPage(offset: number, size: number): Promise<DragonUser[]>;
    getDivineDragoLeaderboard(): Promise<DragonUser[]>;
    getDivineDragoLeaderboardUserCount(): Promise<Record<string, number>>;
}
