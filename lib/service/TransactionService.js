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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const tool_1 = require("./tool");
const ConnectInfo_1 = require("../ConnectInfo");
const BaseService_1 = require("./BaseService");
const BasicException_1 = require("../BasicException");
const vo_1 = require("./vo");
const ethers_1 = require("ethers");
const lodash_1 = __importDefault(require("lodash"));
const Constant_1 = require("../Constant");
const api_1 = require("./api");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
let TransactionService = class TransactionService extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
        this.defaultErrorMsg = 'Please try again. Confirm the transaction and make sure you are paying enough gas!';
    }
    /**
     * 检查交易
     * @param txId
     */
    async checkTransactionError(txId) {
        let count = 1000;
        while (count >= 0) {
            const res = await (0, tool_1.retry)(async () => {
                return await this.provider.getTransactionReceipt(txId);
            });
            if (res != null && res.status != null && res.transactionHash.toLowerCase() === txId.toLowerCase()) {
                if (res.status) {
                    return res;
                }
                else {
                    const errorRes = await this.transactionErrorHandler(txId);
                    throw new BasicException_1.BasicException(errorRes.message, errorRes.error);
                }
            }
            await (0, tool_1.sleep)(tool_1.SLEEP_MS);
            count--;
        }
    }
    /**
     * 发送交易
     * @param contract
     * @param method
     * @param args
     * @param config
     */
    async sendContractTransaction(contract, method, args = [], config = {}) {
        let currentChain = (0, Constant_1.getCurrentAddressInfo)().chainId;
        if (this.connectInfo.chainId === (0, Constant_1.getCurrentAddressInfo)().arbiChainId) {
            const select = (0, Constant_1.getCurrentAddressInfo)().arbiAddressList.find((it) => (0, tool_1.eqAddress)(it, contract.address));
            if (select) {
                currentChain = (0, Constant_1.getCurrentAddressInfo)().arbiChainId;
            }
        }
        if (this.connectInfo.chainId === (0, Constant_1.getCurrentAddressInfo)().mantleChainId) {
            const select = (0, Constant_1.getCurrentAddressInfo)().mantleAddressList.find((it) => (0, tool_1.eqAddress)(it, contract.address));
            if (select) {
                currentChain = (0, Constant_1.getCurrentAddressInfo)().mantleChainId;
            }
        }
        const chainId = (await this.connectInfo.provider.getNetwork()).chainId;
        if (chainId !== currentChain) {
            throw new BasicException_1.BasicException(`Check your wallet network chain id = ${currentChain}!`);
        }
        if (this.connectInfo.connectMethod === 'WEB3') {
            return await this.sendWebWalletTransaction(contract, method, args, config.value);
        }
        if (this.connectInfo.connectMethod === 'EXT') {
            return await this.sendExtTransaction(contract, method, args, config);
        }
        else {
            return await this.sendRpcTransaction(contract, method, args, config);
        }
    }
    async sendExtTransaction(contract, method, args, config) {
        try {
            const estimatedGasLimit = await contract.estimateGas[method](...args, {
                ...config,
                from: this.connectInfo.account,
            });
            config.gasLimit = (0, tool_1.calculateGasMargin)(estimatedGasLimit.toString());
            const data = contract.interface.encodeFunctionData(method, args);
            return new vo_1.ExtTransactionEvent(this.connectInfo, data, {
                ...config,
                from: this.connectInfo.account,
                to: contract.address,
            });
        }
        catch (e) {
            throw new BasicException_1.BasicException(this.convertErrorMsg(e), e);
        }
    }
    async sendWebWalletTransaction(contract, method, args, value = '0') {
        try {
            const data = contract.interface.encodeFunctionData(method, args);
            // 链上预先执行防止API报错
            await this.connectInfo.getWalletOrProvider().estimateGas({
                to: contract.address,
                from: this.connectInfo.account,
                data,
                value,
            });
            const web3WalletConfig = this.connectInfo.walletConnect.wallet;
            const web3WalletApi = new api_1.Web3WalletApi(web3WalletConfig.baseUrl, web3WalletConfig.userToken);
            const gasPrice = await web3WalletApi.gasPrice();
            const suggestFee = gasPrice.suggestBaseFee;
            const gasPriorityFee = +gasPrice.middleGasPrice.gasPrice;
            const maxPriceFee = 2 * +suggestFee + +gasPriorityFee;
            const gasLimitHex = await web3WalletApi.estimate(this.connectInfo, contract.address, data, {
                maxPriceFee,
                gasPriorityFee,
                value,
            });
            const hexNumber = new bignumber_js_1.default(gasLimitHex, 16);
            const gasLimit = hexNumber.toString(10);
            const sign = async (riskToken) => {
                try {
                    return await web3WalletApi.sign(this.connectInfo, contract.address, data, riskToken, {
                        gasLimit,
                        maxPriceFee,
                        gasPriorityFee,
                        value,
                    });
                }
                catch (e) {
                    if (e instanceof BasicException_1.BasicException) {
                        if (e.code === BasicException_1.BasicException.SAFE_CHECK) {
                            const token = await web3WalletConfig.safeCallBack(e.detail);
                            tool_1.Trace.debug('risk token', token);
                            return await sign(token);
                        }
                    }
                    throw e;
                }
            };
            const txNId = await sign('');
            let hash = '';
            let count = 1000;
            while (count >= 0) {
                const res = await (0, tool_1.retry)(() => {
                    return web3WalletApi.result(txNId);
                });
                // 状态，0:初始化 1 风控成功，2 风控失败 3 签名  4:成功 5 失败
                if (res.txHash) {
                    hash = res.txHash;
                    break;
                }
                if (res.status === 4 || res.status === 5) {
                    throw new BasicException_1.BasicException(this.defaultErrorMsg);
                }
                await (0, tool_1.sleep)(tool_1.SLEEP_MS);
                count--;
            }
            return new vo_1.TransactionEvent(this.connectInfo, hash);
        }
        catch (e) {
            if (e instanceof BasicException_1.BasicException) {
                throw e;
            }
            throw new BasicException_1.BasicException(this.convertErrorMsg(e), e);
        }
    }
    async sendRpcTransaction(contract, method, args, config) {
        try {
            const estimatedGasLimit = await contract.estimateGas[method](...args, config);
            config.gasLimit = (0, tool_1.calculateGasMargin)(estimatedGasLimit.toString());
            const awaitTransactionResponse = contract[method];
            const response = await awaitTransactionResponse(...args, config);
            return new vo_1.TransactionEvent(this.connectInfo, response.hash);
        }
        catch (e) {
            throw new BasicException_1.BasicException(this.convertErrorMsg(e), e);
        }
    }
    convertErrorMsg(e) {
        tool_1.Trace.error('ERROR', e);
        let recursiveErr = e;
        let reason;
        // for MetaMask
        if (lodash_1.default.get(recursiveErr, 'data.message')) {
            reason = lodash_1.default.get(recursiveErr, 'data.message');
        }
        else {
            // tslint:disable-next-line:max-line-length
            // https://github.com/Uniswap/interface/blob/ac962fb00d457bc2c4f59432d7d6d7741443dfea/src/hooks/useSwapCallback.tsx#L216-L222
            while (recursiveErr) {
                reason =
                    lodash_1.default.get(recursiveErr, 'reason') ||
                        lodash_1.default.get(recursiveErr, 'data.message') ||
                        lodash_1.default.get(recursiveErr, 'message') ||
                        reason;
                recursiveErr = lodash_1.default.get(recursiveErr, 'error') || lodash_1.default.get(recursiveErr, 'data.originalError');
            }
        }
        reason = reason || this.defaultErrorMsg;
        const REVERT_STR = 'execution reverted: ';
        const indexInfo = reason.indexOf(REVERT_STR);
        const isRevertedError = indexInfo >= 0;
        if (isRevertedError) {
            reason = reason.substring(indexInfo + REVERT_STR.length);
        }
        let msg = reason;
        /*if (msg === 'AMM._update: TRADINGSLIPPAGE_TOO_LARGE_THAN_LAST_TRANSACTION') {
          msg = 'Trading slippage is too large.';
        } else if (msg === 'Amm.burn: INSUFFICIENT_LIQUIDITY_BURNED') {
          msg = "The no. of tokens you're removing is too small.";
        } else if (msg === 'FORBID_INVITE_YOURSLEF') {
          msg = 'Forbid Invite Yourself';
        } else if (msg.lastIndexOf('INSUFFICIENT_QUOTE_AMOUNT') > 0) {
          msg = 'Slippage is too large now, try again later';
        }
        // 不正常的提示
        else*/
        if (!/[A-Za-z0-9\. _\:：%]+/.test(msg)) {
            msg = this.defaultErrorMsg;
        }
        return msg;
    }
    /**
     *
     * @param txId
     * @param message
     */
    async transactionErrorHandler(txId, message = this.defaultErrorMsg) {
        let error = null;
        let errorCode = '';
        try {
            const txData = await this.provider.getTransaction(txId);
            try {
                const s = await this.provider.call(txData, txData.blockNumber);
                tool_1.Trace.debug(s);
            }
            catch (e) {
                errorCode = this.convertErrorMsg(e);
                error = e;
                tool_1.Trace.debug('transactionErrorHandler ERROR ', txId, e);
            }
        }
        catch (e) {
            error = e;
            tool_1.Trace.debug('transactionErrorHandler ERROR ', txId, e);
        }
        if (errorCode !== '') {
            message = errorCode;
        }
        return {
            error,
            message,
        };
    }
    /**
     * 等待几个区块
     * @param web3
     * @param count
     */
    async sleepBlock(count = 1) {
        const fistBlock = await (0, tool_1.retry)(async () => {
            return await this.provider.getBlockNumber();
        });
        while (true) {
            const lastBlock = await (0, tool_1.retry)(async () => {
                return await this.provider.getBlockNumber();
            });
            if (lastBlock - fistBlock >= count) {
                return;
            }
            await (0, tool_1.sleep)(tool_1.SLEEP_MS);
        }
    }
};
__decorate([
    (0, tool_1.EnableProxy)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionService.prototype, "checkTransactionError", null);
__decorate([
    (0, tool_1.EnableProxy)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ethers_1.Contract, String, Array, Object]),
    __metadata("design:returntype", Promise)
], TransactionService.prototype, "sendContractTransaction", null);
TransactionService = __decorate([
    (0, tool_1.CacheKey)('TransactionService'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], TransactionService);
exports.TransactionService = TransactionService;
