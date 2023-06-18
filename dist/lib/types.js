"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketTypeList = exports.OrderTypeList = exports.getListByOrderSide = exports.getCloseSide = exports.OrderSideList = exports.TickerTypeList = void 0;
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
exports.getCloseSide = getCloseSide;
function getListByOrderSide(value) {
    const res = {};
    for (const s of exports.OrderSideList) {
        res[s] = value(s);
    }
    return res;
}
exports.getListByOrderSide = getListByOrderSide;
exports.OrderTypeList = [
    "limit",
    "market"
];
exports.MarketTypeList = [
    "spot",
    "future"
];
