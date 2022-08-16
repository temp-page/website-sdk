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
exports.Erc20Service = void 0;
const Tool_1 = require("../Tool");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ConnectInfo_1 = require("../ConnectInfo");
const BaseService_1 = require("./BaseService");
const vo_1 = require("./vo");
const abi_1 = require("./abi");
const tool_1 = require("./tool");
let Erc20Service = class Erc20Service extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    /**
     * 获取 ERC20的余额
     * @param address
     * @param user
     */
    async getBalance(address, user) {
        if (address === vo_1.ETH_ADDRESS) {
            return this.getEthBalance(user);
        }
        const tokenIns = this.connectInfo.create(abi_1.ERC20, address);
        const result = await this.connectInfo.multiCall().singleCall({
            balance: tokenIns.erc20Instance.balanceOf(user),
            decimals: tokenIns.erc20Instance.decimals()
        });
        const decimal = Number(result.decimals);
        const amount = new bignumber_js_1.default(result.balance).dividedBy(new bignumber_js_1.default(10).pow(decimal)).toFixed();
        Tool_1.Trace.debug("Get ERC20 balance", user, result);
        return {
            amount,
            value: result.balance,
            decimal
        };
    }
    /**
     * 获取 ETH的余额
     * @param user
     */
    async getEthBalance(user) {
        const balance = await this.connectInfo.provider.getBalance(user);
        const decimal = 18;
        const amount = new bignumber_js_1.default(balance.toString()).dividedBy(new bignumber_js_1.default(10).pow(decimal)).toFixed();
        Tool_1.Trace.debug("Get ETH balance", user, balance);
        return {
            amount,
            value: balance.toString(),
            decimal
        };
    }
    /**
     * 获取ERC20的信息
     * @param erc20AddressList
     */
    async getErc20Info(...erc20AddressList) {
        const [...resultList] = await this.connectInfo.multiCall().call(...erc20AddressList.map((erc20Address) => {
            const tokenIns = this.connectInfo.create(abi_1.ERC20, erc20Address);
            return {
                name: tokenIns.erc20Instance.name(),
                symbol: tokenIns.erc20Instance.symbol(),
                decimals: tokenIns.erc20Instance.decimals(),
                address: erc20Address.toLowerCase()
            };
        }));
        return resultList.map((result) => {
            const data = {
                name: result.name,
                symbol: result.symbol,
                decimal: Number(result.decimals),
                decimals: Number(result.decimals),
                address: result.address,
                id: result.address
            };
            Tool_1.Trace.debug("Get currency information", data);
            return data;
        });
    }
    /**
     * 获取合约币允许操作的金额
     * @param exchangeAddress 交易地址
     * @param tokenAddress 币地址
     * @param userAddress  用户地址
     */
    async getAllowance(exchangeAddress, tokenAddress, userAddress) {
        if (tokenAddress === vo_1.ETH_ADDRESS) {
            return {
                amount: "0",
                value: "0",
                decimal: 18,
                showApprove: false
            };
        }
        const tokenIns = this.connectInfo.create(abi_1.ERC20, tokenAddress);
        const result = await this.connectInfo.multiCall().singleCall({
            allowance: tokenIns.erc20Instance.allowance(userAddress, exchangeAddress),
            decimals: tokenIns.erc20Instance.decimals()
        });
        const allowanceBalance = result.allowance;
        const decimal = Number(result.decimals);
        const amount = new bignumber_js_1.default(allowanceBalance).div(10 ** decimal);
        Tool_1.Trace.debug("Get Allowance Amount", exchangeAddress, tokenAddress, userAddress, result, decimal, amount.toFixed());
        return {
            amount: amount.toFixed(),
            value: allowanceBalance,
            decimal,
            showApprove: new bignumber_js_1.default(amount).comparedTo("100000000") <= 0
        };
    }
    /**
     * totalSupply
     * @param tokenAddress 币地址
     */
    async totalSupply(tokenAddress) {
        const tokenIns = this.connectInfo.create(abi_1.ERC20, tokenAddress);
        const value = await tokenIns.totalSupply();
        Tool_1.Trace.debug("Get totalSupply Amount", value);
        return {
            amount: value.toString()
        };
    }
    /**
     * 添加允许合约操作的金额
     * @param exchangeAddress
     * @param tokenAddress
     * @return 交易hash
     */
    async approve(exchangeAddress, tokenAddress) {
        const tokenIns = this.connectInfo.create(abi_1.ERC20, tokenAddress);
        return tokenIns.approve(exchangeAddress, Tool_1.MAXIMUM_U256);
    }
    /**
     * 批量获取余额
     * @param user
     * @param tokens
     */
    async batchGetBalance(user, tokens) {
        const multiCall = this.connectInfo.create(abi_1.MultiCallContract);
        const result = await this.connectInfo.multiCall().call(...tokens.map((it) => {
            const tokenIns = this.connectInfo.create(abi_1.ERC20, it);
            if (it === vo_1.ETH_ADDRESS) {
                return {
                    address: vo_1.ETH_ADDRESS,
                    balance: multiCall.multicall2Instance.getEthBalance(user),
                    decimals: "18"
                };
            }
            return {
                address: it,
                balance: tokenIns.erc20Instance.balanceOf(user),
                decimals: tokenIns.erc20Instance.decimals()
            };
        }));
        const data = {};
        result.forEach((it) => {
            data[it.address] = {
                address: it.address,
                amount: new bignumber_js_1.default(it.balance || "0").div(10 ** parseInt(it.decimals || "0", 10)).toFixed(),
                value: it.balance || "0",
                decimal: parseInt(it.decimals || "0", 10)
            };
        });
        return data;
    }
    /**
     * ERC20转账
     * @param tokenAddress
     * @param to
     * @param amount
     * @return 交易hash
     */
    async transfer(tokenAddress, to, amount) {
        const tokenIns = this.connectInfo.create(abi_1.ERC20, tokenAddress);
        const decimal = await tokenIns.decimals();
        const value = new bignumber_js_1.default(amount).multipliedBy(10 ** decimal).toFixed(0, bignumber_js_1.default.ROUND_DOWN);
        return tokenIns.transfer(to, value);
    }
    /**
     * MINT
     * @deprecated
     * @param tokenAddress
     * @param to
     * @param amount
     * @return 交易hash
     */
    async mint(tokenAddress, to, amount) {
        throw new Error("Not impl");
    }
};
Erc20Service = __decorate([
    (0, tool_1.CacheKey)("Erc20Service"),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], Erc20Service);
exports.Erc20Service = Erc20Service;
