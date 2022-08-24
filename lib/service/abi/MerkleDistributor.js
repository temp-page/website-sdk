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
exports.BalanceTree = exports.MerkleDistributor = void 0;
const BaseService_1 = require("../BaseService");
const ConnectInfo_1 = require("../../ConnectInfo");
const abi_1 = require("../../abi");
const tool_1 = require("../tool");
const ethers_1 = require("ethers");
const bignumber_js_1 = require("bignumber.js");
const merkletreejs_1 = require("merkletreejs");
const keccak256_1 = require("@ethersproject/keccak256");
const mulcall_1 = require("../../mulcall");
const vo_1 = require("../vo");
let MerkleDistributor = class MerkleDistributor extends BaseService_1.BaseService {
    constructor(connectInfo, address) {
        super(connectInfo);
        this.merkleDistributorInstance = new mulcall_1.MulContract(address, abi_1.IMerkleDistributor);
        this.merkleDistributorContract = new ethers_1.Contract(address, abi_1.IMerkleDistributor, connectInfo.getWalletOrProvider());
    }
    async claim(index, account, amount, merkleProof) {
        return this.connectInfo
            .tx()
            .sendContractTransaction(this.merkleDistributorContract, "claim", [index, account, amount, merkleProof], {});
    }
    async isClaimed(index) {
        return await this.merkleDistributorContract.isClaimed(index);
    }
    /**
     * 初始化数据
     * @param user 用户
     * @param token 币
     * @param data account,amount
     */
    async init(user, token, data = []) {
        const [tokenInfo] = await this.connectInfo.erc20().getErc20Info(token);
        const merkleTreeResult = new vo_1.MerkleTreeResult();
        const selfIndex = data.findIndex((it) => it[0].toLowerCase() === user.toLowerCase());
        if (selfIndex < 0) {
            merkleTreeResult.showAmount = "0";
            merkleTreeResult.isClaim = false;
            merkleTreeResult.isExist = false;
            return merkleTreeResult;
        }
        const self = data[selfIndex];
        merkleTreeResult.showAmount = new bignumber_js_1.BigNumber(self[1]).div(10 ** tokenInfo.decimal).toFixed(tokenInfo.decimal, bignumber_js_1.BigNumber.ROUND_DOWN);
        merkleTreeResult.isClaim = await this.isClaimed(Number(selfIndex).toString(10));
        merkleTreeResult.isExist = true;
        if (!merkleTreeResult.isClaim) {
            const balanceTree = new BalanceTree(data);
            tool_1.Trace.debug("ROOT", balanceTree.getHexRoot());
            const proof = balanceTree.getProof(Number(selfIndex).toString(10), self[0], self[1]);
            merkleTreeResult.claim = async () => {
                tool_1.Trace.debug("PARAMS", Number(selfIndex).toString(10), self[0], self[1], proof);
                return this.claim(Number(selfIndex).toString(10), self[0], self[1], proof);
            };
        }
        return merkleTreeResult;
    }
};
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array]),
    __metadata("design:returntype", Promise)
], MerkleDistributor.prototype, "claim", null);
__decorate([
    (0, tool_1.EnableLogs)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", Promise)
], MerkleDistributor.prototype, "init", null);
MerkleDistributor = __decorate([
    (0, tool_1.CacheKey)("MerkleDistributor"),
    __metadata("design:paramtypes", [ConnectInfo_1.ConnectInfo, String])
], MerkleDistributor);
exports.MerkleDistributor = MerkleDistributor;
/**
 * 余额Tree
 */
class BalanceTree {
    constructor(balances) {
        this.tree = new merkletreejs_1.MerkleTree(balances.map(([account, amount], index) => {
            return this.toNode(Number(index).toString(), account.toLowerCase(), amount);
        }), keccak256_1.keccak256, { sort: true });
    }
    toNode(index, account, amount) {
        return Buffer.from(ethers_1.utils.solidityKeccak256(["uint256", "address", "uint256"], [index, account, amount]).slice(2), "hex");
    }
    getHexRoot() {
        return this.tree.getHexRoot();
    }
    getProof(index, account, amount) {
        return this.tree.getHexProof(this.toNode(index, account, amount));
    }
}
exports.BalanceTree = BalanceTree;
