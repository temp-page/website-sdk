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
exports.IBuybackPool = void 0;
const tool_1 = require("../tool");
const BaseService_1 = require("../BaseService");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
const mulcall_1 = require("../../mulcall");
const ethers_1 = require("ethers");
let IBuybackPool = class IBuybackPool extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
        this.buybackPoolInstance = new mulcall_1.MulContract(this.connectInfo.addressInfo.buybackPool, abi_1.BuybackPool);
        this.buybackPoolContract = new ethers_1.Contract(connectInfo.addressInfo.buybackPool, abi_1.BuybackPool, connectInfo.getWalletOrProvider());
    }
    async lastBuyingRate() {
        return (await this.buybackPoolContract.lastBuyingRate()).toString();
    }
};
IBuybackPool = __decorate([
    (0, tool_1.CacheKey)('IBuybackPool'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], IBuybackPool);
exports.IBuybackPool = IBuybackPool;
