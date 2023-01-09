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
exports.IApexPool2 = void 0;
const BaseService_1 = require("../BaseService");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
const tool_1 = require("../tool");
const ethers_1 = require("ethers");
const mulcall_1 = require("../../mulcall");
let IApexPool2 = class IApexPool2 extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
        this.apexPoolInstance = new mulcall_1.MulContract(connectInfo.addressInfo.apexPool, abi_1.ApeXPool2);
        this.apexPoolContract = new ethers_1.Contract(connectInfo.addressInfo.apexPool, abi_1.ApeXPool2, connectInfo.getWalletOrProvider());
    }
    async stakeAPEX(amount) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'stakeAPEX', args, {});
    }
    async stakeEsAPEX(amount) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'stakeEsAPEX', args, {});
    }
    async unstakeAPEX(to, amount) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'unstakeAPEX', args, {});
    }
    async unstakeEsAPEX(to, amount) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.apexPoolContract, 'unstakeEsAPEX', args, {});
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IApexPool2.prototype, "stakeAPEX", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IApexPool2.prototype, "stakeEsAPEX", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IApexPool2.prototype, "unstakeAPEX", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IApexPool2.prototype, "unstakeEsAPEX", null);
IApexPool2 = __decorate([
    (0, tool_1.CacheKey)('IApexPool2'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], IApexPool2);
exports.IApexPool2 = IApexPool2;
