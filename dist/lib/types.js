"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketTypeList = exports.OrderTypeList = exports.OrderSideList = exports.TickerTypeList = void 0;
exports.getCloseSide = getCloseSide;
exports.getListByOrderSide = getListByOrderSide;
exports.getDefaultTicker = getDefaultTicker;
exports.TickerTypeList = [
    "ask",
    "bid"
];
exports.OrderSideList = [
    "buy",
    "sell"
];
function getCloseSide(openSide) {
    return openSide === "buy" ? "sell" : "buy";
}
function getListByOrderSide(value) {
    const res = {};
    for (const s of exports.OrderSideList) {
        res[s] = value(s);
    }
    return res;
}
exports.OrderTypeList = [
    "limit",
    "market"
];
exports.MarketTypeList = [
    "spot",
    "future"
];
function getDefaultTicker() {
    return {
        ask: 0,
        bid: 0,
        timeStamp: 0
    };
}
