"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBBPData = exports.getActionsHistory = exports.getSwapInfo = exports.getBananaApexRateLogs = void 0;
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
      buybackPoolLogs(orderBy:timestamp,orderDirection:desc, first: 1000){
          orderId
          amountIn
          buyingRate
          burned
          timestamp
          hash
      }
      klineLogs(orderBy: timestamp, orderDirection: desc, first: 1000, where: { close_gt: 0 }) {
        open
        close
        high
        low
        timestamp
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
        banana
        usdc
        timestamp
        hash
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
      }
  `;
}
exports.getBBPData = getBBPData;
