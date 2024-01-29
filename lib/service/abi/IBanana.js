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
exports.IBanana = void 0;
const BaseService_1 = require("../BaseService");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
const tool_1 = require("../tool");
const ethers_1 = require("ethers");
const mulcall_1 = require("../../mulcall");
let IBanana = class IBanana extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
        this.bananaInstance = new mulcall_1.MulContract(connectInfo.addressInfo.banana, abi_1.Banana);
        this.bananaContract = new ethers_1.Contract(connectInfo.addressInfo.banana, abi_1.Banana, connectInfo.getWalletOrProvider());
    }
    async redeem(amount) {
        const args = Array.from(arguments);
        tool_1.Trace.debug('claim params', args);
        return this.connectInfo.tx().sendContractTransaction(this.bananaContract, 'redeem', args, {});
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IBanana.prototype, "redeem", null);
IBanana = __decorate([
    (0, tool_1.CacheKey)('IBanana'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], IBanana);
exports.IBanana = IBanana;
