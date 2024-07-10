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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirdropService = void 0;
const BaseService_1 = require("./BaseService");
const ConnectInfo_1 = require("../ConnectInfo");
const tool_1 = require("./tool");
const abi_1 = require("./abi");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const lodash_1 = __importDefault(require("lodash"));
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
        const [airDropInfo, { airdrop_contract, claim_end_time, claim_start_time, stat_end_time, kol_pools, trader_pools }, apexPriceResult,] = await Promise.all([
            this.connectInfo.api().baseApi.apiBaseRequest('/api/airdrop/getPlayer', 'post', {
                my_wallet: user,
            }),
            this.connectInfo.api().baseApi.apiBaseRequest('/api/airdrop/get-airdrop-config', 'post', {}),
            this.connectInfo.api().baseApi.request(
            // bybit api
            `https://api.apex.exchange/v1/data/apex-price`, 'get', {}),
        ]);
        const merkleTreeResult = await this.connectInfo
            .create(abi_1.MerkleDistributor, airdrop_contract)
            .initApiData(user, this.connectInfo.addressInfo.esApex, airDropInfo.can_claim, airDropInfo.index, airDropInfo.reward, airDropInfo.merkle_proof);
        merkleTreeResult.usdPrice = new bignumber_js_1.default(lodash_1.default.get(apexPriceResult, 'result.price', '0')).toFixed();
        merkleTreeResult.totalUsd = new bignumber_js_1.default(merkleTreeResult.usdPrice)
            .multipliedBy(merkleTreeResult.showAmount)
            .toFixed();
        merkleTreeResult.isJoined =
            new bignumber_js_1.default(airDropInfo.volume).comparedTo('0') > 0 || new bignumber_js_1.default(airDropInfo.deposit).comparedTo('0') > 0;
        merkleTreeResult.claim_end_time = claim_end_time;
        merkleTreeResult.claim_start_time = claim_start_time;
        merkleTreeResult.stat_end_time = stat_end_time;
        merkleTreeResult.kol_pools = kol_pools;
        merkleTreeResult.trader_pools = trader_pools;
        return merkleTreeResult;
    }
};
AirdropService = __decorate([
    (0, tool_1.CacheKey)('AirdropService'),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo])
], AirdropService);
exports.AirdropService = AirdropService;
