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
        this.readonlyConnectMap = {};
    }
    getChainConnectInfo(rpc, chainId) {
        const readonlyConnectMapElement = this.readonlyConnectMap[chainId];
        if (!readonlyConnectMapElement) {
            const provider = new ethers_1.providers.StaticJsonRpcProvider(rpc, this.chainId);
            const connectInfo = new ConnectInfo_1.ConnectInfo();
            connectInfo.chainId = this.chainId;
            connectInfo.provider = provider;
            connectInfo.wallet = null;
            connectInfo.status = true;
            connectInfo.addressInfo = this;
            this.readonlyConnectMap[chainId] = connectInfo;
        }
        return this.readonlyConnectMap[chainId];
    }
    readonlyConnectInfo() {
        const rpc = this.rpc;
        const chainId = this.chainId;
        return this.getChainConnectInfo(rpc, chainId);
    }
    arbiReadonlyConnectInfo() {
        const rpc = this.arbRpc;
        const chainId = this.arbiChainId;
        return this.getChainConnectInfo(rpc, chainId);
    }
    mantleReadonlyConnectInfo() {
        const rpc = this.mantleRpc;
        const chainId = this.mantleChainId;
        return this.getChainConnectInfo(rpc, chainId);
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
    getScanTxUrl(chainId, tx) {
        if (chainId === this.mantleChainId) {
            return `${this.mantleScan}/tx/${tx}`;
        }
        else if (chainId === this.arbiChainId) {
            return `${this.arbiScan}/tx/${tx}`;
        }
        else {
            return `${this.scan}/tx/${tx}`;
        }
    }
}
exports.AddressInfo = AddressInfo;
