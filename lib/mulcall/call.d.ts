import { Provider } from '@ethersproject/providers';
import { ContractCall } from './types';
export declare function all<T extends any[] = any[]>(callsAll: ContractCall[], multicallAddress: string, provider: Provider): Promise<T>;
