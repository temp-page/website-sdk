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
exports.AirdropService = void 0;
const BaseService_1 = require("./BaseService");
const ConnectInfo_1 = require("../ConnectInfo");
const tool_1 = require("./tool");
const abi_1 = require("./abi");
/**
 * 空投 业务实现
 */
let AirdropService = class AirdropService extends BaseService_1.BaseService {
    constructor(connectInfo) {
        super(connectInfo);
    }
    /**
     * 交易大赛活动列表
     */
    async backtrackingAirdrop(user = this.connectInfo.account) {
        // if (isNullOrBlank(this.connectInfo.addressInfo.backtrackingAirdrop)) {
        //   const merkleTreeResult = new MerkleTreeResult();
        //   merkleTreeResult.showAmount = "0";
        //   merkleTreeResult.isClaim = false;
        //   merkleTreeResult.isExist = false;
        //   return merkleTreeResult;
        // }
        const [airDropInfo, { airdrop_contract }] = await Promise.all([
            this.connectInfo
                .api()
                .baseApi.apiBaseRequest(this.connectInfo.addressInfo.airdropApi + '/api/airdrop/getPlayer', 'post', {
                my_wallet: user,
            }),
            this.connectInfo
                .api()
                .baseApi.apiBaseRequest(this.connectInfo.addressInfo.airdropApi + '/api/airdrop/get-airdrop-config', 'post', {}),
        ]);
        return await this.connectInfo
            .create(abi_1.MerkleDistributor, airdrop_contract)
            .initApiData(user, this.connectInfo.addressInfo.exApex, airDropInfo.can_claim, airDropInfo.index, airDropInfo.reward, airDropInfo.merkle_proof);
    }
};
AirdropService = __decorate([
    (0, tool_1.CacheKey)('AirdropService'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], AirdropService);
exports.AirdropService = AirdropService;
