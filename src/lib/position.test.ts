import { BaseOrderClass, BasePositionClass, MarketInfo } from "..";

export class TestPositionClass extends BasePositionClass {
    async doOpen() {
        return "id1"
    }
    doClose(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    doCancel(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    doLosscut(): Promise<void> {
        throw new Error("Method not implemented.");
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
    expect(pos.state.orderID).toBe("id1")

    await pos.updateOrder({
        orderID: "id1",
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