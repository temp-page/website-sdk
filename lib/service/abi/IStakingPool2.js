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
exports.IStakingPool2 = void 0;
const BaseService_1 = require("../BaseService");
const tool_1 = require("../tool");
const mulcall_1 = require("../../mulcall");
const ethers_1 = require("ethers");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
let IStakingPool2 = class IStakingPool2 extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
        this.StakingPoolInstance = new mulcall_1.MulContract(connectInfo.addressInfo.stakingPool, abi_1.StakingPool2);
        this.StakingPoolContract = new ethers_1.Contract(connectInfo.addressInfo.stakingPool, abi_1.StakingPool2, connectInfo.getWalletOrProvider());
    }
    async currentDeposit(amount) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.StakingPoolContract, 'currentDeposit', args, {});
    }
    async fixedDeposit(amount, period, preExpireAt) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.StakingPoolContract, 'fixedDeposit', args, {});
    }
    async withdraw(to, amount) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.StakingPoolContract, 'withdraw', args, {});
    }
    async claimReward(to) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.StakingPoolContract, 'claimReward', args, {});
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IStakingPool2.prototype, "currentDeposit", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], IStakingPool2.prototype, "fixedDeposit", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IStakingPool2.prototype, "withdraw", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IStakingPool2.prototype, "claimReward", null);
IStakingPool2 = __decorate([
    (0, tool_1.CacheKey)('IStakingPool2'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], IStakingPool2);
exports.IStakingPool2 = IStakingPool2;
