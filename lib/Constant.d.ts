import { AddressInfo } from "./service";
/**
 * initAddressInfo
 * @param SDK_ENV dev|test|dev_test|internal-test|staging|dev_staging|prod|dev_prod
 */
export declare function initAddressInfo(SDK_ENV: string): AddressInfo;
export declare function getCurrentAddressInfo(): AddressInfo;
