import { Variables } from 'graphql-request/dist/types';
import { ConnectInfo } from '../../ConnectInfo';
import { AddressInfo } from '../vo';
export declare const GRAPH_BANANA_PATH = "/banana";
export declare class BaseApi {
    request<T = any>(path: string, method: 'get' | 'post' | 'put' | 'delete', data: any, config?: any): Promise<T>;
    apiBaseRequest<T = any>(path: string, method: 'get' | 'post' | 'put' | 'delete', data: any, config?: any): Promise<T>;
    graph<T = any, V = Variables>(path: string, query: string, variables: V, l2?: boolean): Promise<T>;
    graphBase<T = any, V = Variables>(fullUrl: string, query: string, variables: V): Promise<T>;
    bananaGraph<T = any, V = Variables>(query: string, variables: V): Promise<T>;
    connectInfo(): ConnectInfo;
    address(): AddressInfo;
}
export declare const BASE_API: BaseApi;
