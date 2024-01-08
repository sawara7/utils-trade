"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnrealizedPL = void 0;
function getUnrealizedPL(openSide, ticker, openPrice, openSize) {
    let unrealized = 0;
    if (openSide === "buy") {
        unrealized = (ticker.bid - openPrice) * openSize;
    }
    if (openSide === "sell") {
        unrealized = (openPrice - ticker.bid) * openSize;
    }
    return unrealized;
}
exports.getUnrealizedPL = getUnrealizedPL;
