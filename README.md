# trade-utils

## Setup
```
npm install github:sawara7/trade-utils 
```

## Features

### Order
```
const market: MarketInfo = {
    name: 'BTC-PERP',
    type: 'future',
    crossOrder: true,
    sizeResolution: 0.001,
    priceResolution: 0.05,
    minOrderSize: 1
}

const order = new BaseOrderClass({
    market: market,
    type: 'limit',
    side: 'buy',
    size: 1,
    price: 100
})
```

### Position
```
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

const pos = new TestPositionClass({
    getOpenOrder: (pos: BasePositionClass)=>{
        return openOrder
    },
    getCloseOrder: (pos: BasePositionClass)=>{
        return closeOrder
    },
    checkOpen: checkOpen,
    checkClose: checkClose
})
```