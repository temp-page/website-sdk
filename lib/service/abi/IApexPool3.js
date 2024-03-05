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
exports.IApexPool3 = void 0;
const BaseService_1 = require("../BaseService");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
const tool_1 = require("../tool");
const ethers_1 = require("ethers");
const mulcall_1 = require("../../mulcall");
let IApexPool3 = class IApexPool3 extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
        const address = connectInfo.isArbi() ? connectInfo.addressInfo.apexRegularStaking.arbi.apexPoolV3 : connectInfo.addressInfo.apexRegularStaking.common.apexPoolV3;
        this.apexPoolInstance = new mulcall_1.MulContract(address, abi_1.ApeXPool3);
        this.apexPoolContract = new ethers_1.Contract(address, abi_1.ApeXPool3, connectInfo.getWalletOrProvider());
    }
    async stakeAPEX(accountId, amount, lockPeriod) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'stakeAPEX', args, {});
    }
    async stakeEsAPEX(accountId, amount, lockPeriod) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'stakeEsAPEX', args, {});
    }
    async unstakeAPEX(stakeId) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'unstakeAPEX', args, {});
    }
    async unstakeEsAPEX(stakeId) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'unstakeEsAPEX', args, {});
    }
    async batchUnstakeAPEX(stakeIds) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'batchUnstakeAPEX', args, {});
    }
    async batchUnstakeEsAPEX(stakeIds) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'batchUnstakeEsAPEX', args, {});
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], IApexPool3.prototype, "stakeAPEX", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], IApexPool3.prototype, "stakeEsAPEX", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IApexPool3.prototype, "unstakeAPEX", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IApexPool3.prototype, "unstakeEsAPEX", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], IApexPool3.prototype, "batchUnstakeAPEX", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], IApexPool3.prototype, "batchUnstakeEsAPEX", null);
IApexPool3 = __decorate([
    (0, tool_1.CacheKey)('IApexPool3'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], IApexPool3);
exports.IApexPool3 = IApexPool3;
