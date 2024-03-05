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
exports.IDragonBall = void 0;
const tool_1 = require("../tool");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
const BaseAbi_1 = require("./BaseAbi");
let IDragonBall = class IDragonBall extends BaseAbi_1.BaseAbi {
    constructor(connectInfo) {
        super(connectInfo, connectInfo.addressInfo.dragonBall.DragonBall, abi_1.DragonBall);
    }
    async batchMint(star, tokenId, signature) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.contract, 'batchMint', args, {});
    }
    async dragon(tokenIds) {
        const args = Array.from(arguments);
        return this.connectInfo.tx().sendContractTransaction(this.contract, 'dragon', args, {});
    }
    async checkMint(star, tokenId) {
        const args = Array.from(arguments);
        return this.contract.checkMint(args);
    }
    async getDivineDragoLeaderboardByPage(offset, size) {
        const [result] = await this.connectInfo.multiCall().call({
            getDivineDragoLeaderboardByPage: this.mulContract.getDivineDragoLeaderboardByPage(offset, size)
        });
        return result.getDivineDragoLeaderboardByPage;
    }
    async getDivineDragoLeaderboard() {
        let offset = 0;
        const size = 100;
        const result = [];
        while (true) {
            const dragonUsers = await this.getDivineDragoLeaderboardByPage(offset, size);
            result.push(...dragonUsers);
            if (dragonUsers.length === 0 || dragonUsers.length < size) {
                break;
            }
            offset += size;
        }
        return result;
    }
    async getDivineDragoLeaderboardUserCount() {
        const dragonUsers = await this.getDivineDragoLeaderboard();
        const result = {};
        dragonUsers.forEach(item => {
            const address = item.user.toLowerCase();
            result[address] = (result[address] || 0) + 1;
        });
        return result;
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array, Array]),
    __metadata("design:returntype", Promise)
], IDragonBall.prototype, "batchMint", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], IDragonBall.prototype, "dragon", null);
IDragonBall = __decorate([
    (0, tool_1.CacheKey)('IDragonBall'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], IDragonBall);
exports.IDragonBall = IDragonBall;
