"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectInfo = void 0;
const service_1 = require("./service");
const BasicException_1 = require("./BasicException");
const Constant_1 = require("./Constant");
const AirdropService_1 = require("./service/AirdropService");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
class ConnectInfo {
    constructor() {
        this._instanceCache = new Map();
    }
    create(clazz, ...args) {
        const cacheKey = clazz.CACHE_KEY;
        if (!cacheKey) {
            const instance = new clazz(this, ...args);
            return instance;
        }
        const key = `${cacheKey}_${JSON.stringify(args)}`;
        const element = this._instanceCache.get(key);
        if (element != null) {
            return element;
        }
        else {
            const instance = (0, service_1.createProxy)(new clazz(this, ...args));
            this._instanceCache.set(key, instance);
            return instance;
        }
    }
    clear() {
        this._instanceCache.clear();
        (0, service_1.clearCache)();
    }
    /**
     * 获取 ERC20 API
     */
    erc20() {
        return this.create(service_1.Erc20Service);
    }
    /**
     * 获取交易API
     */
    tx() {
        return this.create(service_1.TransactionService);
    }
    tradeMining() {
        return this.create(service_1.TradeMiningService);
    }
    tradeMiningV2() {
        return this.create(service_1.TradeMiningV2Service);
    }
    bonus() {
        return this.create(service_1.BonusService);
    }
    apexPool() {
        return this.create(service_1.ApexPoolService);
    }
    airdrop() {
        return this.create(AirdropService_1.AirdropService);
    }
    staking() {
        return this.create(service_1.StakingService);
    }
    /**
     * request service
     */
    api() {
        return (0, Constant_1.getCurrentAddressInfo)().getApiService();
    }
    /**
     * multiCall service
     */
    multiCall() {
        return this.create(service_1.MultiCallContract);
    }
    get provider() {
        if (this._status || this.connectMethod === 'EXT' || this.connectMethod === 'WEB3') {
            return this._provider;
        }
        throw new BasicException_1.BasicException('Wallet not connected!');
    }
    set provider(value) {
        this._provider = value;
    }
    /**
     * 获取连接的状态
     */
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    /**
     * 获取连接的消息
     */
    get msg() {
        return this._msg;
    }
    set msg(value) {
        this._msg = value;
    }
    /**
     * 获取连接的地址
     */
    get account() {
        return this._account;
    }
    set account(value) {
        this._account = value;
    }
    /**
     * 获取连接的网络ID
     */
    get chainId() {
        return this._chainId;
    }
    set chainId(value) {
        this._chainId = value;
    }
    /**
     * 获取连接的地址信息
     */
    get addressInfo() {
        return this._addressInfo;
    }
    set addressInfo(value) {
        this._addressInfo = value;
    }
    set wallet(value) {
        this._wallet = value;
    }
    getWalletOrProvider() {
        return this._wallet || this._provider;
    }
    getScan() {
        if (this.isArbi()) {
            return this.addressInfo.arbiScan;
        }
        if (this.isMantle()) {
            return this.addressInfo.mantleScan;
        }
        return this.addressInfo.scan;
    }
    isArbi() {
        return new bignumber_js_1.default(this.chainId).comparedTo(this.addressInfo.arbiChainId) === 0;
    }
    isMantle() {
        return new bignumber_js_1.default(this.chainId).comparedTo(this.addressInfo.mantleChainId) === 0;
    }
    async addToken(tokenAddress) {
        const token = await this.erc20().getTokenInfo(tokenAddress);
        service_1.Trace.debug('token info', token);
        try {
            const wasAdded = await this.provider.send('wallet_watchAsset', {
                type: 'ERC20',
                options: {
                    address: token.address,
                    symbol: token.symbol,
                    decimals: token.decimal,
                },
            });
            if (wasAdded) {
                return true;
            }
        }
        catch (error) {
            service_1.Trace.error(error);
        }
        return false;
    }
}
exports.ConnectInfo = ConnectInfo;
