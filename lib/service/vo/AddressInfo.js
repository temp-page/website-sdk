"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressInfo = void 0;
const ethers_1 = require("ethers");
const ConnectInfo_1 = require("../../ConnectInfo");
const RequestService_1 = require("../RequestService");
const tool_1 = require("../tool");
/**
 * 地址信息
 */
class AddressInfo {
    constructor() {
        this.apiService = null;
        this.readonlyConnectInfoInstance = null;
        this.arbiReadonlyConnectInfoInstance = null;
    }
    readonlyConnectInfo() {
        if (this.readonlyConnectInfoInstance == null) {
            const provider = new ethers_1.providers.StaticJsonRpcProvider(this.rpc, this.chainId);
            const connectInfo = new ConnectInfo_1.ConnectInfo();
            connectInfo.chainId = this.chainId;
            connectInfo.provider = provider;
            connectInfo.wallet = null;
            connectInfo.status = true;
            connectInfo.addressInfo = this;
            this.readonlyConnectInfoInstance = connectInfo;
        }
        return this.readonlyConnectInfoInstance;
    }
    arbiReadonlyConnectInfo() {
        if (this.arbiReadonlyConnectInfoInstance == null) {
            const provider = new ethers_1.providers.StaticJsonRpcProvider(this.arbRpc, this.arbiChainId);
            const connectInfo = new ConnectInfo_1.ConnectInfo();
            connectInfo.chainId = this.arbiChainId;
            connectInfo.provider = provider;
            connectInfo.wallet = null;
            connectInfo.status = true;
            connectInfo.addressInfo = this;
            this.arbiReadonlyConnectInfoInstance = connectInfo;
        }
        return this.arbiReadonlyConnectInfoInstance;
    }
    getApiService() {
        if (this.apiService == null) {
            this.apiService = (0, tool_1.createProxy)(new RequestService_1.RequestService());
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
