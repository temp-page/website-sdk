import { BaseApi } from "./BaseApi";
import { DragonTopData, DragonUserData } from "../vo";
import { ConnectInfo } from "../../ConnectInfo";
export declare class DragonApi {
    baseApi: BaseApi;
    constructor();
    chainRecords(connect: ConnectInfo): Promise<{
        time: string;
        txs: {
            star: string;
            count: number;
            type: 'increase' | 'decrease';
        }[];
    }[]>;
    top(): Promise<DragonTopData>;
    myNft(privateApi: any, connectInfo: ConnectInfo): Promise<DragonUserData>;
}
