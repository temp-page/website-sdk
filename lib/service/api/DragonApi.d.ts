import { BaseApi } from "./BaseApi";
import { DragonTopData, DragonUserData } from "../vo";
import { ConnectInfo } from "../../ConnectInfo";
export declare class DragonApi {
    baseApi: BaseApi;
    constructor();
    top(): Promise<DragonTopData>;
    myNft(privateApi: any, connectInfo: ConnectInfo): Promise<DragonUserData>;
}
