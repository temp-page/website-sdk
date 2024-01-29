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
exports.DragonApi = void 0;
const tool_1 = require("../tool");
const BaseApi_1 = require("./BaseApi");
const abi_1 = require("../abi");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const lodash_1 = __importDefault(require("lodash"));
const ethers_1 = require("ethers");
const gql_1 = require("./gql");
let DragonApi = class DragonApi {
    constructor() {
        this.baseApi = BaseApi_1.BASE_API;
    }
    async chainRecords(connect) {
        const dragonTransaction = await this.baseApi.arbiDragonNftGraph((0, gql_1.getDragonTransactions)(connect.account), {});
        return dragonTransaction.transactions.map(it => {
            const txs = {};
            it.log.forEach(tx => {
                const tx1 = txs[tx.star] || {
                    star: tx.star,
                    count: 0,
                    type: 'decrease'
                };
                if (tx.action === 'out') {
                    tx1.count = tx1.count - 1;
                }
                else {
                    tx1.count = tx1.count + 1;
                }
                if (tx1.count !== 0) {
                    tx1.type = tx1.count > 0 ? 'increase' : 'decrease';
                    txs[tx.star] = tx1;
                }
                else {
                    delete txs[tx.star];
                }
            });
            return {
                time: it.timestamp,
                txs: Object.values(txs).sort((a, b) => new bignumber_js_1.default(a.star).comparedTo(b.star))
            };
        });
    }
    // 榜单
    async top() {
        // API
        const lotteryRewardList = await this.baseApi.apiBaseRequest(`/api/v2/reward/lottery-reward-list?rewardId=100100&token=usdc`, 'get', {});
        const connectInfo = this.baseApi.arbiConnectInfo();
        const divineDragoNft = connectInfo.create(abi_1.IDivineDragoNft);
        const dDragonBall = connectInfo.create(abi_1.IDragonBall);
        const addressInfo = this.baseApi.address();
        const divineDrago = await dDragonBall.getDivineDragoLeaderboardUserCount();
        const list = (lodash_1.default.get(lotteryRewardList, 'rewardRecordList') || []).map(item => {
            return {
                ...item,
                divineDragonCount: new bignumber_js_1.default(divineDrago[item.ethAddress.toLowerCase()] || 0).toFixed()
            };
        });
        const result = await connectInfo.multiCall().call({
            totalSupply: divineDragoNft.mulContract.totalSupply(),
        }, ...addressInfo.dragonBall.DragonBallNfts.map(item => {
            const dragonBallNft = connectInfo.create(abi_1.IDragonBallNft, item);
            return {
                totalSupply: dragonBallNft.mulContract.totalSupply(),
                ...list.map(topList => {
                    const address = ethers_1.ethers.utils.isAddress(topList.ethAddress);
                    return {
                        ['balanceOf_' + topList.ethAddress]: address ? dragonBallNft.mulContract.balanceOf(topList.ethAddress) : '0'
                    };
                }).reduce((a, b) => ({ ...a, ...b }), {})
            };
        }));
        list.forEach(item => {
            item.mintCount = Array.from(result)
                .slice(1)
                .map(it => it['balanceOf_' + item.ethAddress])
                .reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), "0");
        });
        const divineDragoCount = result[0].totalSupply;
        const mintDragoBallCount = result.slice(1).map(item => item.totalSupply).reduce((a, b) => new bignumber_js_1.default(a).plus(b).toFixed(), "0");
        return {
            tradeAmount: lodash_1.default.get(lotteryRewardList, 'tradeAmount', '0'),
            signCount: lodash_1.default.get(lotteryRewardList, 'signedCount', '0'),
            divineDragoCount,
            mintDragoBallCount: new bignumber_js_1.default(mintDragoBallCount).plus(new bignumber_js_1.default(divineDragoCount).multipliedBy(7)).toFixed(),
            list
        };
    }
    async myNft(privateApi, connectInfo) {
        const result = {
            available: Array.from({ length: 7 }).map((_it, index) => {
                return {
                    star: new bignumber_js_1.default(index + 1).toFixed(),
                    count: 0,
                    mintData: []
                };
            }),
            unavailable: [],
            canMintDragon: false,
            dragonCount: 0,
            mintAllDragonBall: async () => {
                throw new Error('not support');
            },
            mintDragonBall: async () => {
                throw new Error('not support');
            },
            mintDragon: async () => {
                throw new Error('not support');
            }
        };
        if (!connectInfo.isArbi()) {
            return result;
        }
        const lotteryRewardRecord = await privateApi.get('/api/v2/reward/lottery-reward-record', {
            rewardId: '100100',
            token: 'usdc',
            ethAddress: connectInfo.account
        });
        const nftList = lodash_1.default.get(lotteryRewardRecord, 'data.data.rewardList') || [];
        const divineDragoNft = connectInfo.create(abi_1.IDivineDragoNft);
        const dDragonBall = connectInfo.create(abi_1.IDragonBall);
        const contactResult = await connectInfo.multiCall().call({
            balanceOf: divineDragoNft.mulContract.balanceOf(connectInfo.account),
        }, ...nftList.map(item => {
            return {
                checkMint: dDragonBall.mulContract.checkMint(item.star, item.tokenId)
            };
        }));
        const nftBalance = await connectInfo.multiCall().call(...connectInfo.addressInfo.dragonBall.DragonBallNfts.map(item => {
            const dragonBallNft = connectInfo.create(abi_1.IDragonBallNft, item);
            return {
                balanceOf: dragonBallNft.mulContract.balanceOf(connectInfo.account)
            };
        }));
        const nftTokenIds = await connectInfo.multiCall().call(...connectInfo.addressInfo.dragonBall.DragonBallNfts.map((item, index) => {
            const dragonBallNft = connectInfo.create(abi_1.IDragonBallNft, item);
            return {
                ...Object.fromEntries(Array.from(new Array(parseInt(nftBalance[index].balanceOf, 10)).keys())
                    .map((item, index) => ['token' + index, dragonBallNft.mulContract.tokenOfOwnerByIndex(connectInfo.account, index)]))
            };
        }));
        const balanceOf = contactResult[0].balanceOf;
        const checkMintList = contactResult.slice(1).map(item => item.checkMint);
        const noMintList = [];
        nftList.forEach((item, index) => {
            if (!checkMintList[index]) {
                noMintList.push(item);
            }
        });
        const noMintStarGroup = lodash_1.default.groupBy(noMintList, item => item.star);
        result.dragonCount = parseInt(balanceOf, 10);
        result.available = nftTokenIds.map((it, index) => {
            const list = Object.values(it).map(item => {
                return {
                    ethAddress: connectInfo.account,
                    star: new bignumber_js_1.default(index + 1).toFixed(),
                    tokenId: item,
                    sign: ''
                };
            });
            return {
                star: new bignumber_js_1.default(index + 1).toFixed(),
                count: list.length,
                mintData: list
            };
        });
        result.unavailable = Object.entries(noMintStarGroup).map(([key, value]) => {
            const list = value;
            return {
                star: key,
                count: list.length,
                mintData: list
            };
        });
        result.canMintDragon = result.available.filter(it => it.count > 0).length === 7;
        result.mintDragonBall = async (star) => {
            const ddDragonBall = connectInfo.create(abi_1.IDragonBall);
            const data = result.unavailable.find(it => new bignumber_js_1.default(it.star).comparedTo(star) === 0);
            return ddDragonBall.batchMint(data.mintData.map(it => it.star), data.mintData.map(it => it.tokenId), data.mintData.map(it => it.sign));
        };
        result.mintAllDragonBall = async () => {
            const ddDragonBall = connectInfo.create(abi_1.IDragonBall);
            const data = result.unavailable.flatMap(it => it.mintData);
            return ddDragonBall.batchMint(data.map(it => it.star), data.map(it => it.tokenId), data.map(it => it.sign));
        };
        result.mintDragon = async () => {
            const ddDragonBall = connectInfo.create(abi_1.IDragonBall);
            return ddDragonBall.dragon(result.available.map(it => it.mintData[0].tokenId));
        };
        return result;
    }
};
DragonApi = __decorate([
    (0, tool_1.CacheKey)("DragonApi"),
    __metadata("design:paramtypes", [])
], DragonApi);
exports.DragonApi = DragonApi;
