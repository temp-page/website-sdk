import { BaseApi } from './api/BaseApi';
import { TradeMiningApi } from './api/TradeMiningApi';
/**
 * 请求基类 详细信息查看
 */
declare class RequestService {
    baseApi: BaseApi;
    constructor(graphApi: string);
    tradeMiningApi(): TradeMiningApi;
}
export { RequestService };
