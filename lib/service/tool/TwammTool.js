"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeVirtualOrders = void 0;
const bignumber_1 = require("@ethersproject/bignumber");
const ethers_1 = require("ethers");
const abi_1 = require("../abi");
const bigZero = bignumber_1.BigNumber.from(0);
function computeVirtualBalances(tokenAStart, tokenBStart, tokenAIn, tokenBIn) {
    let tokenAOut;
    let tokenBOut;
    let ammEndTokenA;
    let ammEndTokenB;
    // if (
    //   tokenAStart.isZero() ||
    //   tokenBStart.isZero() ||
    //   tokenAIn.isZero() ||
    //   tokenBIn.isZero()
    // ) {
    tokenAOut = tokenAStart
        .add(tokenAIn)
        .mul(tokenBIn)
        .div(tokenBStart.add(tokenBIn));
    tokenBOut = tokenBStart
        .add(tokenBIn)
        .mul(tokenAIn)
        .div(tokenAStart.add(tokenAIn));
    ammEndTokenA = tokenAStart.add(tokenAIn).sub(tokenAOut);
    ammEndTokenB = tokenBStart.add(tokenBIn).sub(tokenBOut);
    // }
    // //when both pools sell, we use the TWAMM formula
    // else {
    //   let k = tokenAStart.mul(tokenBStart);
    //   let c = computeC(tokenAStart, tokenBStart, tokenAIn, tokenBIn);
    //   ammEndTokenA = computeAmmEndTokenA(
    //     tokenAIn,
    //     tokenBIn,
    //     c,
    //     k,
    //     tokenAStart,
    //     tokenBStart
    //   );
    //   ammEndTokenB = tokenAStart.mul(tokenBStart).div(ammEndTokenA);
    //   tokenAOut = tokenAStart.add(tokenAIn).sub(ammEndTokenA);
    //   tokenBOut = tokenBStart.add(tokenBIn).sub(ammEndTokenB);
    // }
    return [tokenAOut, tokenBOut, ammEndTokenA, ammEndTokenB];
}
async function executeVirtualOrders(connectInfo) {
    const pair = connectInfo.create(abi_1.IPair);
    const [pairResult, { getBlockNumber }] = await connectInfo.multiCall().call({
        tokenAReserves: pair.pairInstance.tokenAReserves(),
        tokenBReserves: pair.pairInstance.tokenBReserves(),
        tokenB: pair.pairInstance.tokenB(),
        getTWAMMState: pair.pairInstance.getTWAMMState(),
        getExpiriesSinceLastExecuted: pair.pairInstance.getExpiriesSinceLastExecuted()
    }, {
        getBlockNumber: connectInfo.multiCall().multicall2Instance.getBlockNumber()
    });
    let reserveA = bignumber_1.BigNumber.from(pairResult.tokenAReserves);
    let reserveB = bignumber_1.BigNumber.from(pairResult.tokenBReserves);
    const oldReserveA = bignumber_1.BigNumber.from(pairResult.tokenAReserves);
    const oldReserveB = bignumber_1.BigNumber.from(pairResult.tokenBReserves);
    let lastVirtualOrderBlock = parseInt(pairResult.getTWAMMState.lastVirtualOrderBlock, 10);
    let currentSalesRateA = bignumber_1.BigNumber.from(pairResult.getTWAMMState.tokenASalesRate);
    let currentSalesRateB = bignumber_1.BigNumber.from(pairResult.getTWAMMState.tokenBSalesRate);
    let rewardFactorA = bignumber_1.BigNumber.from(pairResult.getTWAMMState.orderPoolARewardFactor);
    let rewardFactorB = bignumber_1.BigNumber.from(pairResult.getTWAMMState.orderPoolBRewardFactor);
    let expiriesList;
    const resLastVirtualOrderBlock = lastVirtualOrderBlock;
    expiriesList = pairResult.getExpiriesSinceLastExecuted;
    const blockNumber = parseInt(getBlockNumber, 10);
    const [currentTWAMMSalesRateEnding, ...TWAMMSalesRateEndingRes] = await connectInfo.multiCall().call(...[getBlockNumber, ...expiriesList.map(it => it.toString())].map(it => {
        return {
            getExpiriesSinceLastExecuted: pair.pairInstance.getTWAMMSalesRateEnding(it)
        };
    }));
    // execute virtual order settlement to blockNumber
    for (let i = 0; i < expiriesList.length; i++) {
        const iExpiryBlock = expiriesList[i];
        // tslint:disable-next-line:max-line-length
        const iOrderPoolASalesRateEnding = bignumber_1.BigNumber.from(TWAMMSalesRateEndingRes[i].getExpiriesSinceLastExecuted.orderPoolASalesRateEnding);
        // tslint:disable-next-line:max-line-length
        const iOrderPoolBSalesRateEnding = bignumber_1.BigNumber.from(TWAMMSalesRateEndingRes[i].getExpiriesSinceLastExecuted.orderPoolBSalesRateEnding);
        if ((iOrderPoolASalesRateEnding.gt(bigZero) ||
            iOrderPoolBSalesRateEnding.gt(bigZero)) &&
            expiriesList[i] > lastVirtualOrderBlock &&
            expiriesList[i] < blockNumber) {
            // amount sold from virtual trades
            // tslint:disable-next-line:no-shadowed-variable
            const blockNumberIncrement = iExpiryBlock - lastVirtualOrderBlock;
            // tslint:disable-next-line:no-shadowed-variable
            const tokenASellAmount = currentSalesRateA.mul(blockNumberIncrement);
            // tslint:disable-next-line:no-shadowed-variable
            const tokenBSellAmount = currentSalesRateB.mul(blockNumberIncrement);
            // tslint:disable-next-line:no-shadowed-variable
            let [tokenAOut, tokenBOut, ammEndTokenA, ammEndTokenB] = computeVirtualBalances(reserveA, reserveB, tokenASellAmount, tokenBSellAmount);
            // charge LP fee
            ammEndTokenA = ammEndTokenA.add(tokenAOut.mul(3).div(1000));
            ammEndTokenB = ammEndTokenB.add(tokenBOut.mul(3).div(1000));
            tokenAOut = tokenAOut.mul(997).div(1000);
            tokenBOut = tokenBOut.mul(997).div(1000);
            if (!currentSalesRateA.eq(0)) {
                rewardFactorA = rewardFactorA.add(ethers_1.utils.parseUnits(tokenBOut.toString(), 18).div(currentSalesRateA));
            }
            if (!currentSalesRateB.eq(0)) {
                rewardFactorB = rewardFactorB.add(ethers_1.utils.parseUnits(tokenAOut.toString(), 18).div(currentSalesRateB));
            }
            // update state
            reserveA = ammEndTokenA;
            reserveB = ammEndTokenB;
            lastVirtualOrderBlock = iExpiryBlock;
            currentSalesRateA = currentSalesRateA.sub(iOrderPoolASalesRateEnding);
            currentSalesRateB = currentSalesRateB.sub(iOrderPoolBSalesRateEnding);
        }
    }
    // tslint:disable-next-line:max-line-length
    const endOrderPoolASalesRateEnding = bignumber_1.BigNumber.from(currentTWAMMSalesRateEnding.getExpiriesSinceLastExecuted.orderPoolASalesRateEnding);
    // tslint:disable-next-line:max-line-length
    const endOrderPoolBSalesRateEnding = bignumber_1.BigNumber.from(currentTWAMMSalesRateEnding.getExpiriesSinceLastExecuted.orderPoolBSalesRateEnding);
    const blockNumberIncrement = blockNumber - lastVirtualOrderBlock;
    const tokenASellAmount = currentSalesRateA.mul(blockNumberIncrement);
    const tokenBSellAmount = currentSalesRateB.mul(blockNumberIncrement);
    let tokenAOut;
    let tokenBOut;
    let ammEndTokenA;
    let ammEndTokenB;
    [tokenAOut, tokenBOut, ammEndTokenA, ammEndTokenB] = computeVirtualBalances(reserveA, reserveB, tokenASellAmount, tokenBSellAmount);
    // charge LP fee
    ammEndTokenA = ammEndTokenA.add(tokenAOut.mul(3).div(1000));
    ammEndTokenB = ammEndTokenB.add(tokenBOut.mul(3).div(1000));
    tokenAOut = tokenAOut.mul(997).div(1000);
    tokenBOut = tokenBOut.mul(997).div(1000);
    if (!currentSalesRateA.eq(0)) {
        rewardFactorA = rewardFactorA.add(ethers_1.utils.parseUnits(tokenBOut.toString(), 18).div(currentSalesRateA));
    }
    if (!currentSalesRateB.eq(0)) {
        rewardFactorB = rewardFactorB.add(ethers_1.utils.parseUnits(tokenAOut.toString(), 18).div(currentSalesRateB));
    }
    // update state
    reserveA = ammEndTokenA;
    reserveB = ammEndTokenB;
    lastVirtualOrderBlock = blockNumber;
    currentSalesRateA = currentSalesRateA.sub(endOrderPoolASalesRateEnding);
    currentSalesRateB = currentSalesRateB.sub(endOrderPoolBSalesRateEnding);
    return {
        reserveA: reserveA.toString(),
        reserveB: reserveB.toString(),
        resLastVirtualOrderBlock: bignumber_1.BigNumber.from(resLastVirtualOrderBlock).toString(),
        currentSalesRateA: currentSalesRateA.toString(),
        currentSalesRateB: currentSalesRateB.toString(),
        rewardFactorA: rewardFactorA.toString(),
        rewardFactorB: rewardFactorB.toString(),
        oldReserveA: oldReserveA.toString(),
        oldReserveB: oldReserveB.toString(),
        tokenB: pairResult.tokenB
    };
}
exports.executeVirtualOrders = executeVirtualOrders;
