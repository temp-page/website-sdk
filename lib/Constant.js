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
    if ('prod' === SDK_ENV || 'prod_dev' === SDK_ENV) {
        addressInfo.graphApi = 'https://api.apex.exchange/g1/subgraphs/name/apex';
        addressInfo.chainId = 1;
        addressInfo.scan = 'https://etherscan.io';
        addressInfo.rpc = '';
        if (SDK_ENV === 'prod_dev') {
            addressInfo.rpc = '';
        }
        addressInfo.multicall = '0x5ba1e12693dc8f9c48aad8770482f4739beed696';
    }
    else {
        // 默认环境
        addressInfo.graphApi = 'https://g-api.apex.exchange/subgraphs/name/apex';
        addressInfo.chainId = 5;
        addressInfo.scan = 'https://goerli.etherscan.io';
        addressInfo.rpc = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
        addressInfo.multicall = '0x5ba1e12693dc8f9c48aad8770482f4739beed696';
        addressInfo.banana = '0x851C49AcABC499E406207557352e4e35C9E8cEB9';
        addressInfo.bananaClaimable = '0x25f1B201a6c0c373f32BA3725c5F0Cf3EaB60Aea';
        addressInfo.apex = '0xEBb0882632e06cbe8070296F7e4E638639f89068';
        addressInfo.usdc = '0x4FE2E72cBf1dE304C13E5D48fe3813c98d2C30d9';
        addressInfo.pair = '0x224a10A985558361F3aA6827DbD480702F540Fd0';
        addressInfo.twammRouter = '0xcdda22E7286516887B170563d497b658F8CB25CF';
        addressInfo.buybackPool = '0x68a8eA940ce9609D814D5A600AEd615E86F7484D';
        addressInfo.backtrackingAirdrop = '0x5e6C642e4fDF58e8303f144F5260682655Ed0C04';
    }
    // addressInfo.getApiService();
    // addressInfo.readonlyConnectInfo();
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
