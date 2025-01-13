"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApexPoolV3StakeInfo = exports.getApexPoolV3Logs = exports.getApexPoolV2Logs = exports.getDragonTopUsers = exports.getDragonTransactions = exports.getBananaBurnRecord = exports.getActionsV2History = exports.getUserApexPoolStakeInfosV2 = exports.getUserApexPoolStakeInfos = exports.getApexPoolStakeInfos = exports.getStakingInfo = exports.getRedeemRate = exports.getBBPData = exports.getUserActionsHistory = exports.getActionsHistory = exports.getSwapInfo = exports.getBananaApexRateLogs = void 0;
const graphql_request_1 = require("graphql-request");
function getBananaApexRateLogs() {
    return (0, graphql_request_1.gql) `
    query getBananaApexRateLogs {
      bananaApexRateLogs(orderBy: timestamp, orderDirection: desc, first: 1) {
        rate
        bananaPrice
      }
    }
  `;
}
exports.getBananaApexRateLogs = getBananaApexRateLogs;
function getSwapInfo() {
    return (0, graphql_request_1.gql) `
    query getSwapInfo {
      bananaApexRateLogs(orderBy: timestamp, orderDirection: desc, first: 1) {
        rate
        bananaPrice
      }
      usdcTotalSpents {
        amount
      }
      bananaBurns {
        amount
      }
      buybackPoolLogs(orderBy: timestamp, orderDirection: desc, first: 1000) {
        orderId
        amountIn
        buyingRate
        burned
        timestamp
        hash
      }
    }
  `;
}
exports.getSwapInfo = getSwapInfo;
function getActionsHistory() {
    return (0, graphql_request_1.gql) `
    query getActionsHistory($user: String, $actions: [String]) {
      userActionTotalGains(where: { id: $user }) {
        banana
        apex
        usdc
      }
      bananaUserActionsLogs(where: { user: $user, action_in: $actions }, orderBy: timestamp, orderDirection: desc) {
        user
        action
        apex
        esApex
        lpToken
        banana
        usdc
        timestamp
        hash
        expandParams
      }
    }
  `;
}
exports.getActionsHistory = getActionsHistory;
function getUserActionsHistory() {
    return (0, graphql_request_1.gql) `
    query getActionsHistory($user: String, $actions: [String]) {
      bananaUserActionsLogs(where: { user: $user, action_in: $actions }, orderBy: timestamp, orderDirection: desc) {
        user
        action
        apex
        esApex
        lpToken
        banana
        usdc
        timestamp
        hash
        expandParams
      }
    }
  `;
}
exports.getUserActionsHistory = getUserActionsHistory;
function getBBPData() {
    return (0, graphql_request_1.gql) `
      query getBBPData($user: String) {
          bananaBalances(where: {user: $user}) {
              user
              balance
          }
          usdcTotalSpents {
              amount
          }
          bananaApexRateLogs(orderBy: timestamp, orderDirection: desc, first: 1000) {
              bananaPrice
              bananaBurn
              rate
              timestamp
          }
          buybackPoolLogs(orderBy:timestamp,orderDirection:desc, first: 1000){
              orderId
              amountIn
              buyingRate
              burned
              timestamp
              hash
          }
          ${Array.from(new Array(9).keys())
        .map((it) => {
        return `
                bbpPage${it}:bbpbuyAndRedeemRateLogs(orderDirection: asc, orderBy: timestamp, first: 1000  skip:${it * 1000}) {
                    id
                    timestamp
                    bananaBurn
                    redeem
            }`;
    })
        .join('\n')}
      }
  `;
    // bbpbuyAndRedeemRateLogs 全周期52周 = 52 * 7 * 24 = 8736(条数据) 需要拿九次数据才能拿完
}
exports.getBBPData = getBBPData;
function getRedeemRate() {
    return (0, graphql_request_1.gql) `
    query getBananaApexRateLogs {
      bananaApexRateLogs(orderBy: timestamp, orderDirection: desc, first: 1000) {
        rate
        timestamp
      }
    }
  `;
}
exports.getRedeemRate = getRedeemRate;
function getStakingInfo() {
    return (0, graphql_request_1.gql) `
    query getStakingInfo($user: String) {
      stakingInfos {
        totalStake
      }
      stakingDepositedLogs(where: { user: $user, expireAt_gt: 0 }, orderBy: block, orderDirection: desc, first: 1000) {
        id
        user
        amount
        period
        expireAt
        timestamp
      }
    }
  `;
}
exports.getStakingInfo = getStakingInfo;
function getApexPoolStakeInfos() {
    return (0, graphql_request_1.gql) `
    query apexPoolStakeInfos {
      apexPoolStakeInfos {
        apex
        esApex
      }
    }
  `;
}
exports.getApexPoolStakeInfos = getApexPoolStakeInfos;
function getUserApexPoolStakeInfos() {
    return (0, graphql_request_1.gql) `
    query userApexPoolStakeInfos($user: String) {
      apexPoolStakeInfos {
        apex
        esApex
      }
      userStakeInfos(where: { user: $user }) {
        id
        user
        apex
        esApex
      }
    }
  `;
}
exports.getUserApexPoolStakeInfos = getUserApexPoolStakeInfos;
function getUserApexPoolStakeInfosV2() {
    return (0, graphql_request_1.gql) `
    query userApexPoolStakeInfos($user: String) {
      apexPoolStakeInfos {
        apex
        esApex
      }
      userStakeInfos(where: { user: $user }) {
        id
        user
        apex
        esApex
      }
      stakeInfos(where: {user: $user, unstake: false ,tokenName: "apex"}, first: 1000) {
          id
          stakeId
          accountId
          token
          tokenName
          amount
          lockPeriod
          stakeTime
      }
    }
  `;
}
exports.getUserApexPoolStakeInfosV2 = getUserApexPoolStakeInfosV2;
function getActionsV2History() {
    return (0, graphql_request_1.gql) `
        query getActionsHistory($user: String, $actions: [String]) {
            historyTotals(where: { id: $user }) {
                banana: brunBanana
                apex: redeemApex
                usdt: swapUsdt
            }
            bananaUserActionsLogs(where: { user: $user, action_in: $actions }, orderBy: timestamp, orderDirection: desc) {
                user
                action
                apex
                lpToken
                banana
                usdt
                timestamp
                hash
                expandParams
            }
        }
    `;
}
exports.getActionsV2History = getActionsV2History;
function getBananaBurnRecord(from) {
    return (0, graphql_request_1.gql) `
        query getActionsHistory {
            transferLogs(where: {token: "Banana" from:"${from.toLowerCase()}" to:"0x0000000000000000000000000000000000000000"} orderBy:timestamp orderDirection:desc ) {
                amount
                token
                timestamp
                hash
            }
        }
    `;
}
exports.getBananaBurnRecord = getBananaBurnRecord;
function getDragonTransactions(user) {
    return (0, graphql_request_1.gql) `
        query getDragonNFTTransferLogs {
            transactions(where: {user: "${user}"}, orderBy: timestamp, orderDirection: desc, first: 1000) {
                id
                hash
                timestamp
                log(first: 1000, where: {star_gt: 0}) {
                    user
                    action
                    star
                    tokenId
                }
            }
        }
    `;
}
exports.getDragonTransactions = getDragonTransactions;
function getDragonTopUsers() {
    return (0, graphql_request_1.gql) `
        query getTopUsers {
            userInfos(first: 10, orderDirection: desc, orderBy: score, where: {score_gt: 0, id_not_in: ["0xb2ddc67c6c9c0aca3eaaa835765d4a32c90bb1ca"]}) {
                id
                score
                totalStar
                dragon
            }
        }
    `;
}
exports.getDragonTopUsers = getDragonTopUsers;
function getApexPoolV2Logs() {
    return (0, graphql_request_1.gql) `
        query getActionsHistory($user: String, $actions: [String],$tokenName:[String]) {
            stakeLogs(orderBy: block, orderDirection: desc, first: 1000,where:{user:$user,action_in:$actions,tokenName_in:$tokenName}) {
                id
                action
                accountId
                user
                hash
                amount
                block
                token
                tokenName
                timestamp
            }
        }
    `;
}
exports.getApexPoolV2Logs = getApexPoolV2Logs;
function getApexPoolV3Logs() {
    return (0, graphql_request_1.gql) `
        query getActionsHistory($user: String, $actions: [String],$tokenName:[String]) {
            stakeLogs(orderBy: block, orderDirection: desc, first: 1000,where:{user:$user,action_in:$actions,tokenName_in:$tokenName}) {
                id
                action
                accountId
                user
                hash
                amount
                block
                token
                tokenName
                timestamp
                stakeId
                lockPeriod
            }
        }
    `;
}
exports.getApexPoolV3Logs = getApexPoolV3Logs;
function getApexPoolV3StakeInfo() {
    return (0, graphql_request_1.gql) `
        query getActionsHistory($user: String) {
            stakeInfos(where: {user: $user, unstake: false}, first: 1000) {
                id
                stakeId
                accountId
                token
                tokenName
                amount
                lockPeriod
                stakeTime
            }
        }
    `;
}
exports.getApexPoolV3StakeInfo = getApexPoolV3StakeInfo;
