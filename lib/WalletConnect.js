"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnect = exports.Web3Wallet = exports.PrivateWallet = void 0;
const ConnectInfo_1 = require("./ConnectInfo");
const service_1 = require("./service");
const ethers_1 = require("ethers");
const Constant_1 = require("./Constant");
const BasicException_1 = require("./BasicException");
class PrivateWallet {
}
exports.PrivateWallet = PrivateWallet;
class Web3Wallet {
    constructor() {
        this.riskToken = '';
        // tslint:disable-next-line:no-empty
        this.safeCallBack = async () => {
            return '';
        };
    }
}
exports.Web3Wallet = Web3Wallet;
class WalletConnect {
    constructor(walletName) {
        this.wallet = walletName;
        const connectInfo = new ConnectInfo_1.ConnectInfo();
        connectInfo.status = false;
        connectInfo.msg = 'Check your wallet!';
        this.connectInfo = connectInfo;
    }
    disConnect() {
        const connectInfo = this.connectInfo;
        connectInfo.status = false;
        connectInfo.msg = 'Check your wallet!';
        this.update();
    }
    update() {
        const connectInfo = this.connectInfo;
        connectInfo.walletConnect = this;
        if (typeof connectInfo.account === 'undefined' || connectInfo.account === '') {
            connectInfo.status = false;
        }
        const currentAddressInfo = (0, Constant_1.getCurrentAddressInfo)();
        if (connectInfo.status) {
            connectInfo.account = connectInfo.account.toLowerCase();
            connectInfo.addressInfo = currentAddressInfo;
            service_1.Trace.debug('connect success ', connectInfo.account, 'isArbi', connectInfo.isArbi());
        }
        if (connectInfo.status) {
            connectInfo.clear();
        }
    }
    // 测试用，直接私钥+rpc链接
    async privateWallet() {
        const connectInfo = this.connectInfo;
        const privateWallet = this.wallet;
        const provider = privateWallet.provider;
        const wallet = privateWallet.wallet;
        connectInfo.chainId = (await provider.getNetwork()).chainId;
        connectInfo.msg = 'success';
        connectInfo.connectMethod = 'RPC';
        connectInfo.provider = provider;
        connectInfo.account = wallet.address;
        connectInfo.status = true;
        connectInfo.wallet = wallet;
        this.update();
    }
    // bybit 钱包
    async web3Wallet() {
        const connectInfo = this.connectInfo;
        const web3Wallet = this.wallet;
        const provider = new ethers_1.ethers.providers.JsonRpcProvider((0, Constant_1.getCurrentAddressInfo)().rpc);
        connectInfo.chainId = (await provider.getNetwork()).chainId;
        connectInfo.msg = 'success';
        connectInfo.provider = provider;
        connectInfo.account = web3Wallet.address;
        connectInfo.status = true;
        connectInfo.connectMethod = 'WEB3';
        this.update();
    }
    async web3Provider() {
        const connectInfo = this.connectInfo;
        const web3Provider = this.wallet;
        connectInfo.chainId = (await web3Provider.getNetwork()).chainId;
        connectInfo.msg = 'success';
        connectInfo.provider = web3Provider;
        connectInfo.account = await web3Provider.getSigner().getAddress();
        connectInfo.status = true;
        connectInfo.wallet = web3Provider.getSigner();
        connectInfo.connectMethod = 'RPC';
        this.update();
    }
    static connectMetaMask(ethereum) {
        const provider = new ethers_1.providers.Web3Provider(ethereum, 'any');
        return new WalletConnect(provider);
    }
    /**
     * 链接钱包
     * @returns
     */
    async connect() {
        try {
            if (this.wallet instanceof PrivateWallet) {
                await this.privateWallet();
            }
            else if (this.wallet instanceof Web3Wallet) {
                await this.web3Wallet();
            }
            else if (this.wallet instanceof ethers_1.providers.Web3Provider) {
                await this.web3Provider();
            }
            else if (this.wallet.provider) {
                await this.web3Provider();
            }
            else {
                throw new BasicException_1.BasicException('Wallet type error');
            }
            return this.connectInfo;
        }
        catch (e) {
            this.connectInfo.status = false;
            this.connectInfo.msg = e.message || e.toString();
            this.update();
            throw e;
        }
    }
}
exports.WalletConnect = WalletConnect;
