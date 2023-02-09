"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressInfo = void 0;
const ethers_1 = require("ethers");
const ConnectInfo_1 = require("../../ConnectInfo");
const RequestService_1 = require("../RequestService");
/**
 * 地址信息
 */
class AddressInfo {
    constructor() {
        this.readonlyConnectInfoInstance = null;
        this.apiService = null;
    }
    readonlyConnectInfo() {
        if (this.readonlyConnectInfoInstance == null) {
            const provider = new ethers_1.providers.JsonRpcProvider(this.rpc);
            const connectInfo = new ConnectInfo_1.ConnectInfo();
            connectInfo.provider = provider;
            connectInfo.wallet = null;
            connectInfo.status = true;
            connectInfo.addressInfo = this;
            this.readonlyConnectInfoInstance = connectInfo;
        }
        return this.readonlyConnectInfoInstance;
    }
    getApiService() {
        if (this.apiService == null) {
            this.apiService = new RequestService_1.RequestService();
        }
        return this.apiService;
    }
    getEtherscanAddress(address) {
        return `${this.scan}/address/${address}`;
    }
    getEtherscanTx(tx) {
        return `${this.scan}/tx/${tx}`;
    }
    getArbiScanTx(tx) {
        return `${this.arbiScan}/tx/${tx}`;
    }
}
exports.AddressInfo = AddressInfo;
