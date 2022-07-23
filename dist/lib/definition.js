"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketTypeList = exports.OrderTypeList = exports.getCloseSide = exports.OrderSideList = exports.TickerTypeList = void 0;
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
exports.OrderTypeList = [
    "limit",
    "market"
];
exports.MarketTypeList = [
    "spot",
    "future"
];
