import { syncBuiltinESMExports } from "module";
import { execPath } from "process";
import { BaseOrderClass, BasePositionClass, MarketInfo } from "..";
import { sleep } from "my-utils";

export class TestPositionClass extends BasePositionClass {
    async doOpen() {
        return "open1"
    }
    async doClose() {
        return "close1"
    }
    async doCancel(){
        //
    }
}

const marketInfo: MarketInfo = {
    name: 'BCH-PERP',
    type: 'future',
    crossOrder: true,
    sizeResolution: 0.001,
    priceResolution: 0.05,
    minOrderSize: 1
}

const openOrder = new BaseOrderClass({
    market: marketInfo,
    type: 'limit',
    side: 'buy',
    size: 1,
    price: 100
})

const checkOpen = (pos: BasePositionClass): boolean => {
    return true
}

const checkClose = (pos: BasePositionClass): boolean => {
    return true
}

const checkOpenCancel = (pos: BasePositionClass): boolean => {
    return pos.state.orderState === "open"
}

const checkCloseCancel = (pos: BasePositionClass): boolean => {
    return pos.state.orderState === "close"
}

const checkLosscut = (pos: BasePositionClass): boolean => {
    return pos.state.orderState === "losscut"
}

const closeOrder = new BaseOrderClass({
    market: marketInfo,
    type: 'limit',
    side: 'sell',
    size: 1,
    price: 101
})

test('Create PositionClass', () => {
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        checkOpen: checkOpen,
        checkClose: checkClose
    })
    expect(pos.bestAsk).toBe(0)
    expect(pos.bestBid).toBe(0)
    expect(pos.closeCount).toBe(0)
    expect(pos.currentClosePrice).toBe(0)
    expect(pos.currentOpenPrice).toBe(0)
    expect(pos.currentSize).toBe(0)
    expect(pos.losscutCount).toBe(0)
    expect(!pos.losscutPrice).toBeTruthy()
    expect(pos.profit).toBe(0)
    expect(pos.state.enabledOpen).toBeTruthy()
})

test('Open PositionClass', async () => {
    const checkOpen = (pos: BasePositionClass): boolean => {
        return true
    }
    const checkClose = (pos: BasePositionClass): boolean => {
        return false
    }    
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        checkOpen: checkOpen,
        checkClose: checkClose
    })
    await pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    })
    expect(pos.bestAsk).toBe(101)
    expect(pos.bestBid).toBe(100)
    expect(pos.state.enabledOpen).toBe(false)
    expect(pos.state.orderState).toBe("open")
    expect(pos.state.enabledCancel).toBe(true)
    expect(pos.state.orderID).toBe("open1")

    await pos.updateOrder({
        orderID: "open1",
        market: "BCH-PERP",
        type: "limit",
        side: "buy",
        size: 1,
        price: 100,
        status: "closed",
        filledSize: 1,
        remainingSize: 0,
        avgFillPrice: 100
    })
    expect(pos.state.enabledOpen).toBe(false)
    expect(pos.state.orderState).toBe("none")
    expect(pos.state.enabledCancel).toBe(false)
    expect(pos.state.orderID).toBe(undefined)
    expect(pos.currentOpenPrice).toBe(100)
    expect(pos.currentSize).toBe(1)
})

test('Close PositionClass', async () => {
    const checkOpen = (pos: BasePositionClass): boolean => {
        return true
    }
    const checkClose = (pos: BasePositionClass): boolean => {
        return true
    }    
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        checkOpen: checkOpen,
        checkClose: checkClose
    })
    await pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    })
    await pos.updateOrder({
        orderID: "open1",
        market: "BCH-PERP",
        type: "limit",
        side: "buy",
        size: 1,
        price: 100,
        status: "closed",
        filledSize: 1,
        remainingSize: 0,
        avgFillPrice: 100
    })
    await pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    })
    await pos.updateOrder({
        orderID: "close1",
        market: "BCH-PERP",
        type: "limit",
        side: "buy",
        size: 1,
        price: 101,
        status: "closed",
        filledSize: 0.999999999999999999999,
        remainingSize: 0,
        avgFillPrice: 101
    })
    expect(pos.closeCount).toBe(1)
    expect(pos.state.isNoOrder).toBe(true)
    expect(pos.profit).toBe(1)
})

test('Cancel PositionClass', async () => {
    const checkOpen = (pos: BasePositionClass): boolean => {
        return true
    }
    const checkClose = (pos: BasePositionClass): boolean => {
        return true
    }    
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        checkOpen: checkOpen,
        checkClose: checkClose
    })
    await pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    })
    await sleep(10)
    await pos.cancel()
    await sleep(10)
    await pos.updateOrder({
        orderID: "open1",
        market: "BCH-PERP",
        type: "limit",
        side: "buy",
        size: 1,
        price: 100,
        status: "closed",
        filledSize: 0,
        remainingSize: 1,
        avgFillPrice: 0
    })
    expect(pos.closeCount).toBe(0)
    expect(pos.state.isNoOrder).toBe(true)
    expect(pos.state.positionState).toBe("neutral")
    await pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    })
    expect(pos.state.isNoOrder).toBe(false)
    await pos.updateOrder({
        orderID: "open1",
        market: "BCH-PERP",
        type: "limit",
        side: "buy",
        size: 1,
        price: 100,
        status: "closed",
        filledSize: 1,
        remainingSize: 0,
        avgFillPrice: 100
    })
    expect(pos.state.isNoOrder).toBe(true)
    expect(pos.state.positionState).toBe("opened")
    expect(pos.currentSize).toBe(1)
    expect(pos.currentOpenPrice).toBe(100)
    await pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    })
    await sleep(10)
    await pos.cancel()
    await sleep(10)
    await pos.updateOrder({
        orderID: "close1",
        market: "BCH-PERP",
        type: "limit",
        side: "sell",
        size: 1,
        price: 100,
        status: "closed",
        filledSize: 0,
        remainingSize: 1,
        avgFillPrice: 0
    })
    await sleep(10)
    await pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    })
    expect(pos.state.isNoOrder).toBe(false)
    await sleep(10)
    await pos.updateOrder({
        orderID: "close1",
        market: "BCH-PERP",
        type: "limit",
        side: "sell",
        size: 1,
        price: 101,
        status: "closed",
        filledSize: 1,
        remainingSize: 0,
        avgFillPrice: 101
    })
    expect(pos.closeCount).toBe(1)
    expect(pos.state.isNoOrder).toBe(true)
    expect(pos.state.positionState).toBe("closed")
    expect(pos.profit).toBe(1)
})

test('Losscut PositionClass', async () => {
    const checkOpen = (pos: BasePositionClass): boolean => {
        return true
    }
    const checkClose = (pos: BasePositionClass): boolean => {
        return true
    }    
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        losscutPrice: 99,
        checkOpen: checkOpen,
        checkClose: checkClose,
        checkLosscut: checkLosscut
    })
    await pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    })
    await sleep(10)
    await pos.updateOrder({
        orderID: "open1",
        market: "BCH-PERP",
        type: "limit",
        side: "buy",
        size: 1,
        price: 100,
        status: "closed",
        filledSize: 1,
        remainingSize: 0,
        avgFillPrice: 100
    })
    await sleep(10)
    await pos.losscut()
    await sleep(10)
    await pos.updateOrder({
        orderID: "close1",
        market: "BCH-PERP",
        type: "limit",
        side: "sell",
        size: 1,
        price: 99,
        status: "closed",
        filledSize: 1,
        remainingSize: 0,
        avgFillPrice: 99
    })
    expect(pos.closeCount).toBe(1)
    expect(pos.losscutCount).toBe(1)
    expect(pos.currentOpenPrice).toBe(100)
    expect(pos.currentClosePrice).toBe(99)
    expect(pos.state.isNoOrder).toBe(true)
    expect(pos.state.positionState).toBe("closed")
    expect(pos.profit).toBe(-1)
})