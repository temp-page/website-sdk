import { TransactionEvent } from "../TransactionEvent";
export interface DragonTopData {
    /**
     * 当前活动总交易额
     */
    tradeAmount: string;
    /**
     * 当前报名总人数
     */
    signCount: string;
    /**
     * 获得神龙数量
     */
    divineDragoCount: string;
    /**
     * mint 龙珠数量
     * （7个NFT的totalSupply） + 神龙 * 7
     */
    mintDragoBallCount: string;
    /**
     * 榜单
     */
    list: DragonTopList[];
}
export interface DragonTopList {
    /**
     * 排名
     */
    index: number;
    /**
     * eth地址
     */
    ethAddress: string;
    /**
     * 交易量
     */
    tradeAmount: string;
    /**
     * 领取数量
     */
    mintCount: string;
    /**
     * 神龙数量
     */
    divineDragonCount: string;
}
export interface UserDragonBallData {
    /**
     * eth地址
     */
    ethAddress: string;
    /**
     * 星级
     */
    star: string;
    /**
     * tokenId
     */
    tokenId: string;
    /**
     * 签名
     */
    sign: string;
}
export interface DragonUserData {
    /**
     * 已抽列表,1-7星
     */
    available: {
        star: string;
        count: number;
        mintData: UserDragonBallData[];
    }[];
    /**
     * 未领取列表
     */
    unavailable: {
        star: string;
        count: number;
        mintData: UserDragonBallData[];
    }[];
    /**
     * 神龙数量
     */
    dragonCount: number;
    canMintDragon: boolean;
    mintDragonBall: (star: string) => Promise<TransactionEvent>;
    mintDragon: () => Promise<TransactionEvent>;
}
