"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApi = void 0;
const axios_1 = __importDefault(require("axios"));
const Tool_1 = require("../../Tool");
const graphql_request_1 = require("graphql-request");
const BasicException_1 = require("../../BasicException");
const Constant_1 = require("../../Constant");
class BaseApi {
    constructor(graphApi) {
        this.graphApi = graphApi;
        this.baseApi = this;
    }
    async request(path, method, data, config = {
        headers: {},
    }) {
        return await new Promise((resolve, reject) => {
            const requestUrl = path;
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
                Tool_1.Trace.debug(`request success ${method} ${requestUrl} data =`, data, `result = `, res.data);
                resolve(res.data);
            })
                .catch((err) => {
                Tool_1.Trace.debug(`request error ${method} ${requestUrl} data =`, data, `error = `, err);
                const msg = 'Network Error';
                reject(msg);
            });
        });
    }
    async graph(path, query, variables, l2 = true) {
        return this.graphBase(this.graphApi + path, query, variables);
    }
    async graphBase(fullUrl, query, variables) {
        Tool_1.Trace.debug(`graph node request: ${fullUrl}`);
        Tool_1.Trace.debug(query);
        Tool_1.Trace.debug(JSON.stringify(variables));
        try {
            const t = await (0, graphql_request_1.request)(fullUrl, query, variables);
            Tool_1.Trace.debug(`graph node request success data =`, t);
            return t;
        }
        catch (e) {
            Tool_1.Trace.debug('graph node request error', e);
            throw new BasicException_1.BasicException('Request failed', e);
        }
    }
    connectInfo() {
        return (0, Constant_1.getCurrentAddressInfo)().readonlyConnectInfo();
    }
}
exports.BaseApi = BaseApi;
