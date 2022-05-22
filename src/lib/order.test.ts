import { BaseOrderClass, MarketInfo } from ".."

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

test('Order', async () => {
    expect(openOrder.size).toBe(1)
})