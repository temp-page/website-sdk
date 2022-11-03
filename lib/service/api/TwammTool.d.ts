import { ConnectInfo } from '../../ConnectInfo';
declare function executeVirtualOrders(connectInfo: ConnectInfo): Promise<{
    reserveA: string;
    reserveB: string;
    oldReserveA: string;
    oldReserveB: string;
    resLastVirtualOrderBlock: string;
    currentSalesRateA: string;
    currentSalesRateB: string;
    rewardFactorA: string;
    rewardFactorB: string;
    tokenB: string;
}>;
export { executeVirtualOrders };
