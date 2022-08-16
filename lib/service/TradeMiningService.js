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
exports.TradeMiningService = void 0;
const BaseService_1 = require("./BaseService");
const ConnectInfo_1 = require("../ConnectInfo");
const tool_1 = require("./tool");
const vo_1 = require("./vo");
const Erc20Service_1 = require("./Erc20Service");
const IBananaClaimable_1 = require("./abi/IBananaClaimable");
/**
 * Bond API
 */
let TradeMiningService = class TradeMiningService extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    async prizePool(user = this.connectInfo.account) {
        const apiService = this.connectInfo.api();
        const [{ amount }, { bananaPrice, rate }] = await Promise.all([
            this.connectInfo.create(Erc20Service_1.Erc20Service)
                .getBalance(this.addressInfo.banana, user),
            apiService.tradeMiningApi().getBananaRate()
        ]);
        const tradeMiningPrizePool = new vo_1.TradeMiningPrizePool();
        tradeMiningPrizePool.availableBalance = amount;
        tradeMiningPrizePool.price = bananaPrice;
        tradeMiningPrizePool.redeemRate = rate;
        return tradeMiningPrizePool;
    }
    async claim(user, useFor, amount, expireAt, nonce, signature) {
        const bananaClaimable = this.connectInfo
            .create(IBananaClaimable_1.IBananaClaimable);
        return await bananaClaimable
            .claim(user, useFor, amount, expireAt, expireAt, signature);
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TradeMiningService.prototype, "claim", null);
TradeMiningService = __decorate([
    (0, tool_1.CacheKey)("TradeMiningService"),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], TradeMiningService);
exports.TradeMiningService = TradeMiningService;
