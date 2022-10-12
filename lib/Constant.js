"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentAddressInfo = exports.initAddressInfo = void 0;
const service_1 = require("./service");
const BasicException_1 = require("./BasicException");
const contracts_qa_json_1 = __importDefault(require("./contracts-qa.json"));
const contracts_prod_json_1 = __importDefault(require("./contracts-prod.json"));
const contracts_dev_json_1 = __importDefault(require("./contracts-dev.json"));
/**
 * initAddressInfo
 * @param SDK_ENV dev|test|dev_test|internal-test|staging|dev_staging|prod|dev_prod
 */
function initAddressInfo(SDK_ENV) {
    const addressInfo = new service_1.AddressInfo();
    if ('prod' === SDK_ENV || 'prod_dev' === SDK_ENV) {
        addressInfo.airdropApi = 'https://pro.apex.exchange';
        addressInfo.bananaGraphApi = 'https://api.apex.exchange/g1/subgraphs/name/apex/banana';
        addressInfo.chainId = 1;
        addressInfo.scan = 'https://etherscan.io';
        addressInfo.rpc = 'https://eth-mainnet.g.alchemy.com/v2/KF-p7VWklxoDsAcNnWg9GFEWs1KNfYtB';
        if (SDK_ENV === 'prod_dev') {
            addressInfo.rpc = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
        }
        addressInfo.multicall = '0x5ba1e12693dc8f9c48aad8770482f4739beed696';
        addressInfo.banana = contracts_prod_json_1.default.banana.address;
        addressInfo.bananaClaimable = contracts_prod_json_1.default.banana_claimable.address;
        addressInfo.apex = contracts_prod_json_1.default.apex.address;
        addressInfo.usdc = contracts_prod_json_1.default.usdc.address;
        addressInfo.pair = contracts_prod_json_1.default.twamm_pair.address;
        addressInfo.twammRouter = contracts_prod_json_1.default.twamm.address;
        addressInfo.buybackPool = contracts_prod_json_1.default.buyback_pool.address;
        addressInfo.exApex = contracts_prod_json_1.default.es_apex.address;
    }
    else if ('test' === SDK_ENV || 'test_dev' === SDK_ENV) {
        addressInfo.airdropApi = 'https://qa.pro.apex.exchange';
        addressInfo.bananaGraphApi = 'https://g-api.apex.exchange/subgraphs/name/apex/banana';
        addressInfo.chainId = 5;
        addressInfo.scan = 'https://goerli.etherscan.io';
        addressInfo.rpc = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
        addressInfo.multicall = '0x5ba1e12693dc8f9c48aad8770482f4739beed696';
        addressInfo.banana = contracts_qa_json_1.default.banana.address;
        addressInfo.bananaClaimable = contracts_qa_json_1.default.banana_claimable.address;
        addressInfo.apex = contracts_qa_json_1.default.apex.address;
        addressInfo.usdc = contracts_qa_json_1.default.usdc.address;
        addressInfo.pair = contracts_qa_json_1.default.twamm_pair.address;
        addressInfo.twammRouter = contracts_qa_json_1.default.twamm.address;
        addressInfo.buybackPool = contracts_qa_json_1.default.buyback_pool.address;
        addressInfo.exApex = contracts_qa_json_1.default.es_apex.address;
    }
    else {
        // 默认环境
        addressInfo.airdropApi = 'https://dev-airdrop-api.pro.apex.exchange';
        addressInfo.bananaGraphApi = 'https://g-api.apex.exchange/subgraphs/name/apex/banana-dev';
        addressInfo.chainId = 5;
        addressInfo.scan = 'https://goerli.etherscan.io';
        addressInfo.rpc = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
        addressInfo.multicall = '0x5ba1e12693dc8f9c48aad8770482f4739beed696';
        addressInfo.banana = contracts_dev_json_1.default.banana.address;
        addressInfo.bananaClaimable = contracts_dev_json_1.default.banana_claimable.address;
        addressInfo.apex = contracts_dev_json_1.default.apex.address;
        addressInfo.usdc = contracts_dev_json_1.default.usdc.address;
        addressInfo.pair = contracts_dev_json_1.default.twamm_pair.address;
        addressInfo.twammRouter = contracts_dev_json_1.default.twamm.address;
        addressInfo.buybackPool = contracts_dev_json_1.default.buyback_pool.address;
        addressInfo.exApex = contracts_dev_json_1.default.es_apex.address;
    }
    // addressInfo.getApiService();
    // addressInfo.readonlyConnectInfo();
    currentAddressInfo = addressInfo;
    service_1.Trace.debug('INIT NODE_ENV', SDK_ENV);
    service_1.Trace.debug('INIT RPC', addressInfo);
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
