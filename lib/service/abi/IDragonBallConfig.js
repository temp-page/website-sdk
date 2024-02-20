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
exports.IDragonBallConfig = void 0;
const tool_1 = require("../tool");
const BaseAbi_1 = require("./BaseAbi");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
let IDragonBallConfig = class IDragonBallConfig extends BaseAbi_1.BaseAbi {
    constructor(connectInfo) {
        super(connectInfo, connectInfo.addressInfo.dragonBall.DragonBallConfig, abi_1.DragonBallConfig);
    }
};
IDragonBallConfig = __decorate([
    (0, tool_1.CacheKey)('IDragonBallConfig'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], IDragonBallConfig);
exports.IDragonBallConfig = IDragonBallConfig;
