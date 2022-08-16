"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnect = exports.PrivateWallet = exports.rpcUrl = void 0;
const web3_provider_1 = __importDefault(require("@walletconnect/web3-provider"));
const ConnectInfo_1 = require("./ConnectInfo");
const Tool_1 = require("./Tool");
const ethers_1 = require("ethers");
const lodash_1 = __importDefault(require("lodash"));
const Constant_1 = require("./Constant");
exports.rpcUrl = {
    1: 'https://mainnet.infura.io/v3/f6a9e5c4490849bb998a0c54718678f9',
    42: 'https://kovan.infura.io/v3/f6a9e5c4490849bb998a0c54718678f9',
    4: 'https://rinkeby.infura.io/v3/f6a9e5c4490849bb998a0c54718678f9',
    56: 'https://bsc-dataseed.binance.org/',
    256: 'https://http-testnet.hecochain.com',
    128: 'https://http-mainnet-node.huobichain.com',
    97: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
    66: 'https://exchainrpc.okex.org',
    65: 'https://exchaintestrpc.okex.org',
    80001: 'https://naughty-blackwell:waffle-sprawl-math-used-ripple-snarl@nd-311-035-380.p2pify.com',
    42161: 'https://arb1.arbitrum.io/rpc',
    137: 'https://polygon-rpc.com/',
    10: 'https://mainnet.optimism.io',
    250: 'https://rpc.ftm.tools/',
    421611: 'https://rinkeby.arbitrum.io/rpc',
};
class PrivateWallet {
}
exports.PrivateWallet = PrivateWallet;
class WalletConnect {
    constructor(walletName, callback) {
        this.wallet = walletName;
        const connectInfo = new ConnectInfo_1.ConnectInfo();
        connectInfo.status = false;
        connectInfo.msg = 'Check your wallet!';
        this.connectInfo = connectInfo;
        this.callback = callback;
    }
    disConnect() {
        const connectInfo = this.connectInfo;
        connectInfo.status = false;
        connectInfo.msg = 'Check your wallet!';
        this.update();
    }
    update() {
        const connectInfo = this.connectInfo;
        if (typeof connectInfo.account === 'undefined' || connectInfo.account === '') {
            connectInfo.status = false;
        }
        const currentAddressInfo = (0, Constant_1.getCurrentAddressInfo)();
        if (connectInfo.status) {
            connectInfo.account = connectInfo.account.toLowerCase();
            connectInfo.addressInfo = currentAddressInfo;
            Tool_1.Trace.debug('connect success ', connectInfo.account);
        }
        if (connectInfo.status) {
            connectInfo.clear();
        }
        this.callback(connectInfo);
    }
    async walletconnect() {
        const connectInfo = this.connectInfo;
        const provider = new web3_provider_1.default({
            rpc: exports.rpcUrl,
            qrcodeModalOptions: {
                mobileLinks: [
                    'mathwallet',
                    'bitkeep',
                    'rainbow',
                    'metamask',
                    'argent',
                    'trust',
                    'imtoken',
                    'pillar',
                    'tokenpocket',
                ],
            },
        });
        const accounts = await provider.enable();
        // @ts-ignore
        const walletConnectProvider = new ethers_1.providers.Web3Provider(provider, 'any');
        connectInfo.account = accounts[0];
        connectInfo.wallet = walletConnectProvider.getSigner();
        connectInfo.chainId = (await walletConnectProvider.getNetwork()).chainId;
        connectInfo.msg = 'success';
        connectInfo.provider = walletConnectProvider;
        connectInfo.status = true;
        this.update();
        // tslint:disable-next-line:no-shadowed-variable
        provider.on('accountsChanged', (accounts) => {
            connectInfo.status = true;
            connectInfo.account = accounts[0];
            connectInfo.wallet = walletConnectProvider.getSigner();
            connectInfo.msg = 'accountsChanged';
            this.update();
        });
        provider.on('chainChanged', async () => {
            connectInfo.status = true;
            connectInfo.chainId = (await walletConnectProvider.getNetwork()).chainId;
            connectInfo.msg = 'chainChanged';
            this.update();
        });
        provider.on('disconnect', (code, reason) => {
            connectInfo.status = false;
            connectInfo.msg = 'disconnect';
            this.update();
            console.error('disconnect', code, reason);
        });
    }
    async metamask() {
        const connectInfo = this.connectInfo;
        // @ts-ignore
        const _ethereum = this.getEthereum();
        if (!_ethereum) {
            connectInfo.status = false;
            connectInfo.msg = 'Check your wallet!';
            this.update();
        }
        else {
            const accounts = await _ethereum.enable();
            const provider = new ethers_1.providers.Web3Provider(_ethereum, 'any');
            connectInfo.account = accounts[0];
            connectInfo.wallet = provider.getSigner();
            connectInfo.chainId = (await provider.getNetwork()).chainId;
            connectInfo.msg = 'success';
            connectInfo.provider = provider;
            connectInfo.status = true;
            this.update();
            // tslint:disable-next-line:no-shadowed-variable
            _ethereum.on('accountsChanged', (accounts) => {
                connectInfo.account = accounts[0];
                connectInfo.wallet = provider.getSigner();
                connectInfo.msg = 'accountsChanged';
                connectInfo.status = true;
                this.update();
            });
            _ethereum.on('chainChanged', async () => {
                connectInfo.status = true;
                connectInfo.chainId = (await provider.getNetwork()).chainId;
                connectInfo.msg = 'chainChanged';
                this.update();
            });
        }
    }
    async privateWallet() {
        const connectInfo = this.connectInfo;
        const privateWallet = this.wallet;
        const provider = privateWallet.provider;
        const wallet = privateWallet.wallet;
        connectInfo.chainId = (await provider.getNetwork()).chainId;
        connectInfo.msg = 'success';
        connectInfo.provider = provider;
        connectInfo.account = wallet.address;
        connectInfo.status = true;
        connectInfo.wallet = wallet;
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
        this.update();
    }
    /**
     * 链接钱包
     * @returns
     */
    async connect() {
        try {
            if (this.wallet === 'walletconnect') {
                await this.walletconnect();
            }
            else if ([
                'metamask',
                'mathwallet',
                'bitkeep',
                'rainbow',
                'argent',
                'trust',
                'imtoken',
                'pillar',
                'tokenpocket',
            ].includes(this.wallet)) {
                await this.metamask();
            }
            else if (this.wallet instanceof PrivateWallet) {
                await this.privateWallet();
            }
            else if (this.wallet instanceof ethers_1.providers.Web3Provider) {
                await this.web3Provider();
            }
            else {
                this.update();
            }
        }
        catch (e) {
            this.connectInfo.status = false;
            this.connectInfo.msg = e.message || e.toString();
            this.update();
        }
    }
    getEthereum() {
        // @ts-ignore
        return this.wallet === 'bitkeep' ? lodash_1.default.get(window, 'bitkeep.ethereum') : window.ethereum;
    }
    /**
     * 一键切换链
     * @param chainName "Arbitrum" | "Arbitrum Testnet" | rinkeby | mainnet
     */
    switchChain(chainName) {
        // @ts-ignore
        const _ethereum = this.getEthereum();
        if (!_ethereum) {
            return;
        }
        const map = {
            'Arbitrum Testnet': [
                {
                    chainId: '0x66EEB',
                    chainName: 'Arbitrum Testnet',
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                    },
                    rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
                    blockExplorerUrls: ['https://testnet.arbiscan.io/'],
                },
            ],
            'Arbitrum one': [
                {
                    chainId: '0xA4B1',
                    chainName: 'Arbitrum',
                    nativeCurrency: {
                        name: 'ETH',
                        symbol: 'ETH',
                        decimals: 18,
                    },
                    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                    blockExplorerUrls: ['https://explorer.arbitrum.io'],
                },
            ],
            rinkeby: '0x4',
            goerli: '0x5',
            mainnet: '0x1',
        };
        const data = map[chainName];
        if (!data) {
            return;
        }
        if (typeof data === 'string') {
            _ethereum
                .request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: data,
                    },
                ],
            })
                .catch();
            return;
        }
        _ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch();
    }
}
exports.WalletConnect = WalletConnect;
