import { BaseApi } from "./api/BaseApi";
/**
 * 请求基类 详细信息查看
 */
declare class RequestService {
    baseApi: BaseApi;
    constructor(graphApi: string);
}
export { RequestService };
