import { BaseService } from "../BaseService";
import { ConnectInfo } from "../../ConnectInfo";
import { MulContract } from "../../mulcall";
import { Contract } from "ethers";
export declare class IBuybackPool extends BaseService {
    buybackPoolInstance: MulContract;
    buybackPoolContract: Contract;
    constructor(connectInfo: ConnectInfo);
    lastBuyingRate(): Promise<string>;
}
