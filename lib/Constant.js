"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentAddressInfo = exports.initNetAddress = exports.initAddressInfo = void 0;
const service_1 = require("./service");
const BasicException_1 = require("./BasicException");
const contracts_qa_json_1 = __importDefault(require("./contracts-qa.json"));
const contracts_prod_json_1 = __importDefault(require("./contracts-prod.json"));
const contracts_arbi_goerli_json_1 = __importDefault(require("./contracts-arbi-goerli.json"));
/**
 * initAddressInfo
 * @param SDK_ENV dev|test|dev_test|internal-test|staging|dev_staging|prod|dev_prod
 */
function initAddressInfo(SDK_ENV) {
    const addressInfo = new service_1.AddressInfo();
    if ('prod' === SDK_ENV || 'prod_dev' === SDK_ENV) {
        addressInfo.apexProBaseUrl = 'https://pro.apex.exchange';
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
        addressInfo.arbiChainId = 42161;
        addressInfo.arbiScan = 'https://arbiscan.io';
        addressInfo.arbiApex = contracts_arbi_goerli_json_1.default.apex.address;
        addressInfo.arbiApexPool = contracts_arbi_goerli_json_1.default.apex_pool.address;
        addressInfo.arbiMulticall = '0x82D550B27bA4FD402aAD58ECe8C393FcEC6b4afa';
        // TODO change to prod
        // addressInfo.arbiBananaGraphApi = "";
        // addressInfo.stakingPool = contractsProdConfig.staking_pool.address;
        // addressInfo.apexPool = contractsProdConfig.apex_pool.address;
        addressInfo.esApex = contracts_prod_json_1.default.es_apex.address;
    }
    else if ('test' === SDK_ENV || 'test_dev' === SDK_ENV) {
        addressInfo.apexProBaseUrl = 'https://qa.pro.apex.exchange';
        addressInfo.bananaGraphApi = 'https://g-api.apex.exchange/subgraphs/name/apex/banana-staking';
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
        addressInfo.esApex = contracts_qa_json_1.default.es_apex.address;
        addressInfo.stakingPool = contracts_qa_json_1.default.staking_pool.address;
        addressInfo.apexPool = contracts_qa_json_1.default.apex_pool.address;
        addressInfo.arbiChainId = 421613;
        addressInfo.arbiScan = 'https://goerli.arbiscan.io';
        addressInfo.arbiApex = contracts_arbi_goerli_json_1.default.apex.address;
        addressInfo.arbiApexPool = contracts_arbi_goerli_json_1.default.apex_pool.address;
        addressInfo.arbiMulticall = '0x9cce21d5e2740d6b8ccf109dbf3cdf2569c03e74';
        addressInfo.arbiBananaGraphApi = 'https://goerli-arbi-graph.pro.apex.exchange/subgraphs/name/apex/banana-staking';
    }
    else {
        // 默认环境
        addressInfo.apexProBaseUrl = 'https://dev-airdrop-api.pro.apex.exchange';
        addressInfo.bananaGraphApi = 'https://g-api.apex.exchange/subgraphs/name/apex/banana-staking';
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
        addressInfo.esApex = contracts_qa_json_1.default.es_apex.address;
        addressInfo.stakingPool = contracts_qa_json_1.default.staking_pool.address;
        addressInfo.apexPool = contracts_qa_json_1.default.apex_pool.address;
        addressInfo.arbiChainId = 421613;
        addressInfo.arbiScan = 'https://goerli.arbiscan.io';
        addressInfo.arbiApex = contracts_arbi_goerli_json_1.default.apex.address;
        addressInfo.arbiApexPool = contracts_arbi_goerli_json_1.default.apex_pool.address;
        addressInfo.arbiMulticall = '0x9cce21d5e2740d6b8ccf109dbf3cdf2569c03e74';
        addressInfo.arbiBananaGraphApi = 'https://goerli-arbi-graph.pro.apex.exchange/subgraphs/name/apex/banana-staking';
    }
    addressInfo.arbiAddressList = [addressInfo.arbiApex, addressInfo.arbiMulticall, addressInfo.arbiApexPool];
    // addressInfo.getApiService();
    // addressInfo.readonlyConnectInfo();
    currentAddressInfo = addressInfo;
    service_1.Trace.debug('INIT NODE_ENV', SDK_ENV);
    service_1.Trace.debug('INIT RPC', addressInfo);
    return addressInfo;
}
exports.initAddressInfo = initAddressInfo;
/**
 * initAddressInfo
 * @param SDK_ENV dev|test|dev_test|internal-test|staging|dev_staging|prod|dev_prod
 * @param apexBaseApi
 */
async function initNetAddress(SDK_ENV, apexBaseApi = '') {
    const addressInfo = new service_1.AddressInfo();
    if ('prod' === SDK_ENV || 'prod_dev' === SDK_ENV) {
        const baseApi = (0, service_1.isNullOrBlank)(apexBaseApi) ? 'https://pro.apex.exchange' : apexBaseApi;
        addressInfo.apexProBaseUrl = baseApi;
        addressInfo.bananaGraphApi = 'https://api.apex.exchange/g1/subgraphs/name/apex/banana';
        addressInfo.chainId = 1;
        addressInfo.scan = 'https://etherscan.io';
        addressInfo.rpc = 'https://eth-mainnet.g.alchemy.com/v2/KF-p7VWklxoDsAcNnWg9GFEWs1KNfYtB';
        if (SDK_ENV === 'prod_dev') {
            addressInfo.rpc = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
        }
        addressInfo.multicall = '0x5ba1e12693dc8f9c48aad8770482f4739beed696';
        addressInfo.arbiChainId = 42161;
        addressInfo.arbiScan = 'https://arbiscan.io';
        addressInfo.arbiMulticall = '0x82D550B27bA4FD402aAD58ECe8C393FcEC6b4afa';
        // TODO 待确认
        addressInfo.arbiBananaGraphApi = '';
    }
    else {
        const baseApi = (0, service_1.isNullOrBlank)(apexBaseApi) ? 'https://qa.pro.apex.exchange' : apexBaseApi;
        addressInfo.apexProBaseUrl = baseApi;
        // 非测试环境
        if ('test' !== SDK_ENV && 'test_dev' !== SDK_ENV) {
            if (typeof window !== 'undefined') {
                addressInfo.apexProBaseUrl = (0, service_1.getValue)(window, 'location.origin', baseApi);
            }
        }
        addressInfo.bananaGraphApi = 'https://g-api.apex.exchange/subgraphs/name/apex/banana-staking';
        addressInfo.chainId = 5;
        addressInfo.scan = 'https://goerli.etherscan.io';
        addressInfo.rpc = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
        addressInfo.multicall = '0x5ba1e12693dc8f9c48aad8770482f4739beed696';
        addressInfo.arbiChainId = 421613;
        addressInfo.arbiScan = 'https://goerli.arbiscan.io';
        addressInfo.arbiMulticall = '0x9cce21d5e2740d6b8ccf109dbf3cdf2569c03e74';
        addressInfo.arbiBananaGraphApi = 'https://goerli-arbi-graph.pro.apex.exchange/subgraphs/name/apex/banana-staking';
    }
    const res = await service_1.BASE_API.request(addressInfo.apexProBaseUrl + '/api/v1/mine/contracts', 'get', {});
    const getAddress = (key, defaultAddress = '') => {
        return res.data.contractInfoList.filter((it) => it.key === key).map((it) => it.address)[0] || defaultAddress;
    };
    addressInfo.banana = getAddress('banana');
    addressInfo.bananaClaimable = getAddress('banana_claimable');
    addressInfo.apex = getAddress('apex');
    addressInfo.usdc = getAddress('usdc');
    addressInfo.pair = getAddress('twamm_pair');
    addressInfo.twammRouter = getAddress('twamm');
    addressInfo.buybackPool = getAddress('buyback_pool');
    addressInfo.esApex = getAddress('es_apex');
    addressInfo.stakingPool = getAddress('staking_pool');
    addressInfo.apexPool = getAddress('apex_pool');
    addressInfo.bananaGraphApi = getAddress('graph_url', addressInfo.bananaGraphApi);
    addressInfo.arbiApex = getAddress('arbi_apex');
    addressInfo.arbiApexPool = getAddress('arbi_apex_pool');
    addressInfo.arbiBananaGraphApi = getAddress('arbi_banana_graph', addressInfo.arbiBananaGraphApi);
    addressInfo.rpc = res.data.rpc.url || addressInfo.rpc;
    addressInfo.arbiAddressList = [addressInfo.arbiApex, addressInfo.arbiMulticall, addressInfo.arbiApexPool];
    // addressInfo.getApiService();
    // addressInfo.readonlyConnectInfo();
    currentAddressInfo = addressInfo;
    service_1.Trace.debug('INIT NODE_ENV', SDK_ENV);
    service_1.Trace.debug('INIT RPC', addressInfo);
    return addressInfo;
}
exports.initNetAddress = initNetAddress;
let currentAddressInfo = null;
function getCurrentAddressInfo() {
    if (currentAddressInfo === null) {
        throw new BasicException_1.BasicException('not initialized');
    }
    return currentAddressInfo;
}
exports.getCurrentAddressInfo = getCurrentAddressInfo;
