"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnect = exports.PrivateWallet = void 0;
const ConnectInfo_1 = require("./ConnectInfo");
const Tool_1 = require("./service/tool/Tool");
const ethers_1 = require("ethers");
const lodash_1 = __importDefault(require("lodash"));
const Constant_1 = require("./Constant");
class PrivateWallet {
}
exports.PrivateWallet = PrivateWallet;
class WalletConnect {
    constructor(walletName, callback) {
        this.wallet = walletName;
        const connectInfo = new ConnectInfo_1.ConnectInfo();
        connectInfo.status = false;
        connectInfo.msg = "Check your wallet!";
        this.connectInfo = connectInfo;
        this.callback = callback;
    }
    disConnect() {
        const connectInfo = this.connectInfo;
        connectInfo.status = false;
        connectInfo.msg = "Check your wallet!";
        this.update();
    }
    update() {
        const connectInfo = this.connectInfo;
        if (typeof connectInfo.account === "undefined" || connectInfo.account === "") {
            connectInfo.status = false;
        }
        const currentAddressInfo = (0, Constant_1.getCurrentAddressInfo)();
        if (connectInfo.status) {
            connectInfo.account = connectInfo.account.toLowerCase();
            connectInfo.addressInfo = currentAddressInfo;
            Tool_1.Trace.debug("connect success ", connectInfo.account);
        }
        if (connectInfo.status) {
            connectInfo.clear();
            currentAddressInfo.successConnectInfoInstance = connectInfo;
        }
        else {
            currentAddressInfo.successConnectInfoInstance = null;
        }
        this.callback(connectInfo);
    }
    async metamask() {
        const connectInfo = this.connectInfo;
        // @ts-ignore
        const _ethereum = this.getEthereum();
        if (!_ethereum) {
            connectInfo.status = false;
            connectInfo.msg = "Check your wallet!";
            this.update();
        }
        else {
            const accounts = await _ethereum.enable();
            const provider = new ethers_1.providers.Web3Provider(_ethereum, "any");
            connectInfo.account = accounts[0];
            connectInfo.wallet = provider.getSigner();
            connectInfo.chainId = (await provider.getNetwork()).chainId;
            connectInfo.msg = "success";
            connectInfo.provider = provider;
            connectInfo.status = true;
            this.update();
            // tslint:disable-next-line:no-shadowed-variable
            _ethereum.on("accountsChanged", (accounts) => {
                connectInfo.account = accounts[0];
                connectInfo.wallet = provider.getSigner();
                connectInfo.msg = "accountsChanged";
                connectInfo.status = true;
                this.update();
            });
            _ethereum.on("chainChanged", async () => {
                connectInfo.status = true;
                connectInfo.chainId = (await provider.getNetwork()).chainId;
                connectInfo.msg = "chainChanged";
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
        connectInfo.msg = "success";
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
        connectInfo.msg = "success";
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
            if ([
                "metamask",
                "mathwallet",
                "bitkeep",
                "rainbow",
                "argent",
                "trust",
                "imtoken",
                "pillar",
                "tokenpocket"
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
        return this.wallet === "bitkeep" ? lodash_1.default.get(window, "bitkeep.ethereum") : window.ethereum;
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
            "Arbitrum Testnet": [
                {
                    chainId: "0x66EEB",
                    chainName: "Arbitrum Testnet",
                    nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18
                    },
                    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
                    blockExplorerUrls: ["https://testnet.arbiscan.io/"]
                }
            ],
            "Arbitrum one": [
                {
                    chainId: "0xA4B1",
                    chainName: "Arbitrum",
                    nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18
                    },
                    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
                    blockExplorerUrls: ["https://explorer.arbitrum.io"]
                }
            ],
            rinkeby: "0x4",
            goerli: "0x5",
            mainnet: "0x1"
        };
        const data = map[chainName];
        if (!data) {
            return;
        }
        if (typeof data === "string") {
            _ethereum
                .request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: data
                    }
                ]
            })
                .catch();
            return;
        }
        _ethereum.request({ method: "wallet_addEthereumChain", params: data }).catch();
    }
}
exports.WalletConnect = WalletConnect;
