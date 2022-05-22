"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPositionClass = void 0;
const __1 = require("..");
class TestPositionClass extends __1.BasePositionClass {
    doOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            return "open1";
        });
    }
    doClose() {
        return __awaiter(this, void 0, void 0, function* () {
            return "close1";
        });
    }
    doCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
    doLosscut() {
        return __awaiter(this, void 0, void 0, function* () {
            //
        });
    }
}
exports.TestPositionClass = TestPositionClass;
const marketInfo = {
    name: 'BCH-PERP',
    type: 'future',
    crossOrder: true,
    sizeResolution: 0.001,
    priceResolution: 0.05,
    minOrderSize: 1
};
const openOrder = new __1.BaseOrderClass({
    market: marketInfo,
    type: 'limit',
    side: 'buy',
    size: 1,
    price: 100
});
const checkOpen = (pos) => {
    return true;
};
const checkClose = (pos) => {
    return true;
};
const checkOpenCancel = (pos) => {
    return pos.state.orderState === "open";
};
const checkCloseCancel = (pos) => {
    return pos.state.orderState === "close";
};
const checkLosscut = (pos) => {
    return pos.state.orderState === "losscut";
};
const closeOrder = new __1.BaseOrderClass({
    market: marketInfo,
    type: 'limit',
    side: 'sell',
    size: 1,
    price: 101
});
test('Create PositionClass', () => {
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        checkOpen: checkOpen,
        checkClose: checkClose
    });
    expect(pos.bestAsk).toBe(0);
    expect(pos.bestBid).toBe(0);
    expect(pos.closeCount).toBe(0);
    expect(pos.currentClosePrice).toBe(0);
    expect(pos.currentOpenPrice).toBe(0);
    expect(pos.currentSize).toBe(0);
    expect(pos.losscutCount).toBe(0);
    expect(!pos.losscutPrice).toBeTruthy();
    expect(pos.profit).toBe(0);
    expect(pos.state.enabledOpen).toBeTruthy();
});
test('Open PositionClass', () => __awaiter(void 0, void 0, void 0, function* () {
    const checkOpen = (pos) => {
        return true;
    };
    const checkClose = (pos) => {
        return false;
    };
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        checkOpen: checkOpen,
        checkClose: checkClose
    });
    yield pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    });
    expect(pos.bestAsk).toBe(101);
    expect(pos.bestBid).toBe(100);
    expect(pos.state.enabledOpen).toBe(false);
    expect(pos.state.orderState).toBe("open");
    expect(pos.state.enabledCancel).toBe(true);
    expect(pos.state.orderID).toBe("open1");
    yield pos.updateOrder({
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
    });
    expect(pos.state.enabledOpen).toBe(false);
    expect(pos.state.orderState).toBe("none");
    expect(pos.state.enabledCancel).toBe(false);
    expect(pos.state.orderID).toBe(undefined);
    expect(pos.currentOpenPrice).toBe(100);
    expect(pos.currentSize).toBe(1);
}));
test('Close PositionClass', () => __awaiter(void 0, void 0, void 0, function* () {
    const checkOpen = (pos) => {
        return true;
    };
    const checkClose = (pos) => {
        return true;
    };
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        checkOpen: checkOpen,
        checkClose: checkClose
    });
    yield pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    });
    yield pos.updateOrder({
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
    });
    yield pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    });
    yield pos.updateOrder({
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
    });
    expect(pos.closeCount).toBe(1);
    expect(pos.state.isNoOrder).toBe(true);
    expect(pos.profit).toBe(1);
}));
test('Cancel PositionClass', () => __awaiter(void 0, void 0, void 0, function* () {
    const checkOpen = (pos) => {
        return true;
    };
    const checkClose = (pos) => {
        return true;
    };
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        checkOpen: checkOpen,
        checkClose: checkClose
    });
    yield pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    });
    yield pos.cancel();
    yield pos.updateOrder({
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
    });
    expect(pos.closeCount).toBe(0);
    expect(pos.state.isNoOrder).toBe(true);
    expect(pos.state.positionState).toBe("neutral");
    yield pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    });
    expect(pos.state.isNoOrder).toBe(false);
    yield pos.updateOrder({
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
    });
    expect(pos.state.isNoOrder).toBe(true);
    expect(pos.state.positionState).toBe("opened");
    expect(pos.currentSize).toBe(1);
    expect(pos.currentOpenPrice).toBe(100);
    yield pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    });
    yield pos.cancel();
    yield pos.updateOrder({
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
    });
    yield pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    });
    expect(pos.state.isNoOrder).toBe(false);
    yield pos.updateOrder({
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
    });
    expect(pos.closeCount).toBe(1);
    expect(pos.state.isNoOrder).toBe(true);
    expect(pos.state.positionState).toBe("closed");
    expect(pos.profit).toBe(1);
}));
test('Cancel PositionClass', () => __awaiter(void 0, void 0, void 0, function* () {
    const checkOpen = (pos) => {
        return true;
    };
    const checkClose = (pos) => {
        return true;
    };
    const pos = new TestPositionClass({
        openOrder: openOrder,
        closeOrder: closeOrder,
        checkOpen: checkOpen,
        checkClose: checkClose
    });
    yield pos.updateTicker({
        time: Date.now().toString(),
        bid: 100.0,
        ask: 101.0
    });
    yield pos.updateOrder({
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
    });
    yield pos.losscut();
    yield pos.updateOrder({
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
    });
    expect(pos.closeCount).toBe(1);
    expect(pos.state.isNoOrder).toBe(true);
    expect(pos.state.positionState).toBe("closed");
    expect(pos.profit).toBe(1);
}));
