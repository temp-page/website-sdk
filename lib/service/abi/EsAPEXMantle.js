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
exports.EsAPEXMantle = void 0;
const BaseService_1 = require("../BaseService");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
const tool_1 = require("../tool");
const ethers_1 = require("ethers");
const mulcall_1 = require("../../mulcall");
let EsAPEXMantle = class EsAPEXMantle extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
        this.esApexInstance = new mulcall_1.MulContract(connectInfo.addressInfo.mantleEsApex, abi_1.IEsAPEX2);
        this.esApexContract = new ethers_1.Contract(connectInfo.addressInfo.mantleEsApex, abi_1.IEsAPEX2, connectInfo.getWalletOrProvider());
    }
    async vest(amount) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.esApexContract, 'vest', args, {});
    }
    async batchWithdraw(to, vestIds, amounts) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.esApexContract, 'batchWithdraw', args, {});
    }
    async batchForceWithdraw(to, vestIds) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.esApexContract, 'batchForceWithdraw', args, {});
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EsAPEXMantle.prototype, "vest", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Array]),
    __metadata("design:returntype", Promise)
], EsAPEXMantle.prototype, "batchWithdraw", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], EsAPEXMantle.prototype, "batchForceWithdraw", null);
EsAPEXMantle = __decorate([
    (0, tool_1.CacheKey)('EsAPEXMantle'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], EsAPEXMantle);
exports.EsAPEXMantle = EsAPEXMantle;
