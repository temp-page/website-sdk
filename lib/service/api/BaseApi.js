"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_API = exports.BaseApi = void 0;
const axios_1 = __importDefault(require("axios"));
const tool_1 = require("../tool");
const graphql_request_1 = require("graphql-request");
const BasicException_1 = require("../../BasicException");
const Constant_1 = require("../../Constant");
class BaseApi {
    async request(path, method, data, config = {
        headers: {},
    }) {
        return await new Promise((resolve, reject) => {
            let requestUrl = path;
            if (path.includes('omni.apex.exchange')) {
                requestUrl = path.replace(/(omni\.apex\.exchange\/api\/)(v[12])/, '$1v3');
            }
            const req = {
                url: requestUrl,
                method,
                params: undefined,
                data: undefined,
                headers: {},
            };
            if (['get', 'delete'].indexOf(method.toLowerCase()) > -1) {
                req.params = data;
            }
            else {
                req.data = data;
            }
            if (config.headers) {
                req.headers = config.headers;
            }
            (0, axios_1.default)(req)
                .then((res) => {
                tool_1.Trace.debug(`request success ${method} ${requestUrl} data =`, data, `result = `, res.data);
                resolve(res.data);
            })
                .catch((err) => {
                tool_1.Trace.debug(`request error ${method} ${requestUrl} data =`, data, `error = `, err);
                const msg = 'Network Error';
                reject(msg);
            });
        });
    }
    async apiBaseRequest(path, method, data, config = {
        headers: {},
    }) {
        const result = await this.request((0, Constant_1.getCurrentAddressInfo)().apexProBaseUrl + path, method, data, config);
        if (result.code) {
            throw new BasicException_1.BasicException(result.msg);
        }
        return result.data;
    }
    async graphBase(fullUrl, query, variables) {
        tool_1.Trace.debug(`graph node request: ${fullUrl}`, query, variables);
        try {
            const t = await (0, graphql_request_1.request)(fullUrl, query, variables);
            tool_1.Trace.debug(`graph node request success data =`, t);
            return t;
        }
        catch (e) {
            tool_1.Trace.debug('graph node request error', e);
            throw new BasicException_1.BasicException('Request failed', e);
        }
    }
    async bananaGraph(query, variables) {
        return this.graphBase((0, Constant_1.getCurrentAddressInfo)().bananaGraphApi, query, variables);
    }
    async bananaV2Graph(query, variables) {
        return this.graphBase((0, Constant_1.getCurrentAddressInfo)().bananaV2GraphApi, query, variables);
    }
    async arbiBananaGraph(query, variables) {
        return this.graphBase((0, Constant_1.getCurrentAddressInfo)().arbiBananaGraphApi, query, variables);
    }
    async arbiDragonNftGraph(query, variables) {
        return this.graphBase((0, Constant_1.getCurrentAddressInfo)().arbiDragonNftGraphApi, query, variables);
    }
    connectInfo() {
        return (0, Constant_1.getCurrentAddressInfo)().readonlyConnectInfo();
    }
    arbiConnectInfo() {
        return (0, Constant_1.getCurrentAddressInfo)().arbiReadonlyConnectInfo();
    }
    address() {
        return (0, Constant_1.getCurrentAddressInfo)();
    }
}
exports.BaseApi = BaseApi;
exports.BASE_API = new BaseApi();
