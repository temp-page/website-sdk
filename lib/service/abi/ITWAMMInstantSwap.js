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
exports.ITWAMMInstantSwap = void 0;
const BaseService_1 = require("../BaseService");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
const tool_1 = require("../tool");
const ethers_1 = require("ethers");
const mulcall_1 = require("../../mulcall");
let ITWAMMInstantSwap = class ITWAMMInstantSwap extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
        this.TWAMMInstantSwapInstance = new mulcall_1.MulContract(connectInfo.addressInfo.twammRouter, abi_1.TWAMMInstantSwap);
        this.TWAMMInstantSwapContract = new ethers_1.Contract(connectInfo.addressInfo.twammRouter, abi_1.TWAMMInstantSwap, connectInfo.getWalletOrProvider());
    }
    async instantSwapTokenToToken(token0, token1, amountIn, amountOutMin, deadline) {
        const args = Array.from(arguments);
        return await this.connectInfo
            .tx()
            .sendContractTransaction(this.TWAMMInstantSwapContract, 'instantSwapTokenToToken', args, {});
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ITWAMMInstantSwap.prototype, "instantSwapTokenToToken", null);
ITWAMMInstantSwap = __decorate([
    (0, tool_1.CacheKey)('ITWAMMInstantSwap'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], ITWAMMInstantSwap);
exports.ITWAMMInstantSwap = ITWAMMInstantSwap;
