import { BaseApi, TradeMiningApi } from './api';
/**
 * 请求基类 详细信息查看
 */
declare class RequestService {
    baseApi: BaseApi;
    constructor();
    tradeMiningApi(): TradeMiningApi;
}
export { RequestService };
