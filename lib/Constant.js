"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentAddressInfo = exports.initAddressInfo = void 0;
const service_1 = require("./service");
const BasicException_1 = require("./BasicException");
const Tool_1 = require("./service/tool/Tool");
/**
 * initAddressInfo
 * @param SDK_ENV dev|test|dev_test|internal-test|staging|dev_staging|prod|dev_prod
 */
function initAddressInfo(SDK_ENV) {
    const addressInfo = new service_1.AddressInfo();
    if ("prod" === SDK_ENV || "prod_dev" === SDK_ENV) {
        addressInfo.graphApi = "https://api.apex.exchange/g1/subgraphs/name/apex";
        addressInfo.chainId = 1;
        addressInfo.scan = "https://etherscan.io/";
        addressInfo.rpc = "";
        if (SDK_ENV === "prod_dev") {
            addressInfo.rpc = "";
        }
        addressInfo.multicall = "0x5ba1e12693dc8f9c48aad8770482f4739beed696";
    }
    else {
        // 默认环境
        addressInfo.graphApi = "https://g-api.apex.exchange/subgraphs/name/apex";
        addressInfo.chainId = 5;
        addressInfo.scan = "https://goerli.etherscan.io/";
        addressInfo.rpc = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
        addressInfo.multicall = "0x5ba1e12693dc8f9c48aad8770482f4739beed696";
        addressInfo.banana = "0xAed97054763C0785F73408E0b642F28E2DeD836a";
        addressInfo.bananaClaimable = "0xc2F96F31E0234492918aA0195e9858bB3aa8261C";
        addressInfo.apex = "0x8aA6B0E10BD6DBaf5159967F92f2E740afE2b4C3";
        addressInfo.usdc = "0x39c6e50227cbd9bc80b18f1f918d73c91b44293c";
        addressInfo.pair = "0xA4025254f729EA328B0021eCA1714365B9E834b5";
    }
    addressInfo.getApiService();
    addressInfo.readonlyConnectInfo();
    currentAddressInfo = addressInfo;
    Tool_1.Trace.debug("INIT NODE_ENV", SDK_ENV);
    Tool_1.Trace.debug("INIT RPC", addressInfo);
    return addressInfo;
}
exports.initAddressInfo = initAddressInfo;
let currentAddressInfo = null;
function getCurrentAddressInfo() {
    if (currentAddressInfo === null) {
        throw new BasicException_1.BasicException("not initialized");
    }
    return currentAddressInfo;
}
exports.getCurrentAddressInfo = getCurrentAddressInfo;
