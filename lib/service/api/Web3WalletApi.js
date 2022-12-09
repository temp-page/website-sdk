"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3WalletApi = void 0;
const BaseApi_1 = require("./BaseApi");
const tool_1 = require("../tool");
const BasicException_1 = require("../../BasicException");
let Web3WalletApi = class Web3WalletApi {
    constructor(baseUrl, token) {
        this.baseApi = BaseApi_1.BASE_API;
        this.baseUrl = baseUrl;
        this.token = token;
        this.chainCode = 'ETH';
    }
    async request(path, method, data, config = {
        headers: {},
    }) {
        config.headers.userToken = this.token;
        const result = await this.baseApi.request(this.baseUrl + path, method, data, config);
        if (result.ret_code > 0) {
            throw new BasicException_1.BasicException(result.ret_msg);
        }
        return result.result;
    }
    async gasPrice() {
        const result = await this.request('/spot/api/web3/wallet/gasPrice', 'get', {});
        return result;
    }
    async estimate(connectInfo, toAddress, data, config) {
        const body = {
            chainCode: this.chainCode,
            amount: config.value || '0',
            data: data,
            toAddress: toAddress,
            fromAddress: connectInfo.account,
            maxPriceFee: config.maxPriceFee,
            gasPriorityFee: config.gasPriorityFee,
        };
        const result = await this.request('/spot/api/web3/wallet/eth/estimate', 'post', body);
        return result;
    }
    async sign(connectInfo, toAddress, data, config) {
        // spot/api/web3/wallet/eth/sign
        const body = {
            chainCode: this.chainCode,
            amount: config.value || '0',
            data: data,
            toAddress: toAddress,
            fromAddress: connectInfo.account,
            gasLimit: config.gasLimit,
            maxPriceFee: config.maxPriceFee,
            gasPriorityFee: config.gasPriorityFee,
        };
        const result = await this.request('/spot/api/web3/wallet/eth/sign', 'post', body);
        return result.txnId;
    }
    async result(txnId) {
        // /spot/api/web3/wallet/eth/sign/result
        const result = await this.request('/spot/api/web3/wallet/eth/sign/result?txnId=' + txnId, 'get', {});
        return result;
    }
};
Web3WalletApi = __decorate([
    (0, tool_1.CacheKey)('Web3WalletApi'),
    __metadata("design:paramtypes", [String, String])
], Web3WalletApi);
exports.Web3WalletApi = Web3WalletApi;
