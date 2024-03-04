"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = void 0;
const contracts_1 = require("@ethersproject/contracts");
const abi_1 = require("./abi");
const multicall_1 = require("./abi/multicall");
const service_1 = require("../service");
const chunk_1 = __importDefault(require("lodash/chunk"));
const CHUNK_SIZE = 255;
async function all(callsAll, multicallAddress, provider) {
    const multicall = new contracts_1.Contract(multicallAddress, multicall_1.multicallAbi, provider);
    const callAllRequests = callsAll.map((call) => {
        const callData = abi_1.Abi.encode(call.name, call.inputs, call.params);
        return {
            target: call.contract.address,
            callData,
        };
    });
    const callRequestsChuck = (0, chunk_1.default)(callAllRequests, CHUNK_SIZE);
    const callsList = (0, chunk_1.default)(callsAll, CHUNK_SIZE);
    const callResult = [];
    for (let index = 0; index < callRequestsChuck.length; index++) {
        const calls = callsList[index];
        const callRequests = callRequestsChuck[index];
        const response = await multicall.tryAggregate(false, callRequests);
        for (let i = 0; i < calls.length; i++) {
            const outputs = calls[i].outputs;
            const result = response[i];
            if (result.success) {
                try {
                    const params = abi_1.Abi.decode(outputs, result.returnData);
                    callResult.push(params);
                }
                catch (e) {
                    service_1.Trace.error('decode error', calls[i], callRequests[i], outputs, result.returnData, e);
                    throw e;
                }
            }
            else {
                callResult.push(undefined);
            }
        }
    }
    return callResult;
}
exports.all = all;
