"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStakingInfo = exports.getRedeemRate = exports.getBBPData = exports.getActionsHistory = exports.getSwapInfo = exports.getBananaApexRateLogs = void 0;
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
    query getActionsHistory($user: String) {
      userActionTotalGains(where: { id: $user }) {
        banana
        apex
        usdc
      }
      bananaUserActionsLogs(where: { user: $user }, orderBy: timestamp, orderDirection: desc) {
        user
        action
        apex
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
        stakingDepositedLogs(where: { user: $user,expireAt_gt: 0}, orderBy: block, orderDirection: desc, first: 1000) {
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
