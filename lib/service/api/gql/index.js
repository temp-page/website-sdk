"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBananaApexRateLogs = void 0;
const graphql_request_1 = require("graphql-request");
function getBananaApexRateLogs() {
    return (0, graphql_request_1.gql) `{
      bananaApexRateLogs(orderBy: timestamp, orderDirection: desc, first: 1) {
          rate
          bananaPrice
      }
  }`;
}
exports.getBananaApexRateLogs = getBananaApexRateLogs;
