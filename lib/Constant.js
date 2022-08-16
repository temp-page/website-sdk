"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentAddressInfo = exports.initAddressInfo = void 0;
const service_1 = require("./service");
const BasicException_1 = require("./BasicException");
const Tool_1 = require("./Tool");
/**
 * initAddressInfo
 * @param SDK_ENV dev|test|dev_test|internal-test|staging|dev_staging|prod|dev_prod
 */
function initAddressInfo(SDK_ENV) {
    const addressInfo = new service_1.AddressInfo();
    if ('test' === SDK_ENV || 'dev_test' === SDK_ENV) {
        // testnet
        addressInfo.graphApi = 'https://beta-api.apex.exchange/subgraphs/name/apex';
        addressInfo.env = 'beta';
        addressInfo.chainId = 421611;
        addressInfo.scan = 'https://testnet.arbiscan.io';
        addressInfo.rpc = 'https://arb-rinkeby.g.alchemy.com/v2/-sG04aBxC9LSWDyOY_GP0zuH_u6V7kSr';
        if ('dev_test' === SDK_ENV) {
            addressInfo.rpc = 'https://rinkeby.arbitrum.io/rpc';
        }
        addressInfo.api = 'https://test-api.apex.exchange/v1';
        addressInfo.multicall = '';
    }
    else if ('staging' === SDK_ENV || 'dev_staging' === SDK_ENV || 'prod' === SDK_ENV || 'dev_prod' === SDK_ENV) {
        // staging
        if ('prod' === SDK_ENV || 'dev_prod' === SDK_ENV) {
            addressInfo.graphApi = 'https://api.apex.exchange/g2/subgraphs/name/apex';
            addressInfo.env = 'prod';
            addressInfo.chainId = 42161;
            addressInfo.scan = 'https://arbiscan.io';
            addressInfo.rpc = 'https://rpc-arbitrum.apex.exchange/rpc';
            if (SDK_ENV === 'dev_prod') {
                addressInfo.rpc = 'https://arb1.arbitrum.io/rpc';
            }
            addressInfo.api = 'https://api.apex.exchange/v1';
        }
        else {
            addressInfo.graphApi = 'https://staging-api.apex.exchange/g2/subgraphs/name/apex';
            addressInfo.env = 'staging';
            addressInfo.chainId = 42161;
            addressInfo.scan = 'https://arbiscan.io';
            addressInfo.rpc = 'https://rpc-arbitrum.apex.exchange/rpc';
            if (SDK_ENV === 'dev_staging') {
                addressInfo.rpc = 'https://arb1.arbitrum.io/rpc';
            }
            addressInfo.api = 'https://staging-api.apex.exchange/v1';
        }
    }
    else {
        // 默认环境
        addressInfo.graphApi = 'https://dev-api.apex.exchange/g2/subgraphs/name/apex';
        addressInfo.env = 'dev';
        addressInfo.chainId = 421611;
        addressInfo.scan = 'https://testnet.arbiscan.io';
        if ('dev' === SDK_ENV) {
            addressInfo.rpc = 'https://arb-rinkeby.g.alchemy.com/v2/-sG04aBxC9LSWDyOY_GP0zuH_u6V7kSr';
        }
        else {
            addressInfo.rpc = 'https://rinkeby.arbitrum.io/rpc';
        }
        addressInfo.api = 'https://dev-api.apex.exchange/v1';
        addressInfo.multicall = '';
    }
    addressInfo.getApiService();
    addressInfo.readonlyConnectInfo();
    addressInfo.readonlyConnectInfo();
    currentAddressInfo = addressInfo;
    Tool_1.Trace.debug('INIT NODE_ENV', SDK_ENV);
    Tool_1.Trace.debug('INIT RPC', addressInfo);
    return addressInfo;
}
exports.initAddressInfo = initAddressInfo;
let currentAddressInfo = null;
function getCurrentAddressInfo() {
    if (currentAddressInfo === null) {
        throw new BasicException_1.BasicException('not initialized');
    }
    return currentAddressInfo;
}
exports.getCurrentAddressInfo = getCurrentAddressInfo;
