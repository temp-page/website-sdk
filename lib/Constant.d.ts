import { AddressInfo } from './service';
/**
 * initAddressInfo
 * @param SDK_ENV dev|test|dev_test|internal-test|staging|dev_staging|prod|dev_prod
 */
export declare function initAddressInfo(SDK_ENV: string): AddressInfo;
/**
 * initAddressInfo
 * @param SDK_ENV dev|test|dev_test|internal-test|staging|dev_staging|prod|dev_prod
 * @param apexBaseApi
 */
export declare function initNetAddress(SDK_ENV: string, _apexBaseApi?: string): Promise<AddressInfo>;
export declare function getCurrentAddressInfo(): AddressInfo;
