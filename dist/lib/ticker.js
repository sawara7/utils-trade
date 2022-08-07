"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withinLimitOrderRange = exports.hasExecutedLimitOrder = exports.enabledExecuteLimitOrder = exports.TickerClass = void 0;
const my_utils_1 = require("my-utils");
class TickerClass extends my_utils_1.BaseObjectClass {
    constructor(intervalSec, sequenceNum) {
        super();
        this._sequenceList = new my_utils_1.SequenceList(intervalSec, sequenceNum);
    }
    update(ticker) {
        const tk = {
            ask: ticker.ask,
            bid: ticker.bid,
            timestamp: Date.now()
        };
        this._sequenceList.push(tk);
    }
    get bestBid() {
        return this._sequenceList.lastValue("bid");
    }
    get bestAsk() {
        return this._sequenceList.lastValue("ask");
    }
}
exports.TickerClass = TickerClass;
// その値段で指値注文可能か
function enabledExecuteLimitOrder(orderSide, orderPrice, ticker) {
    return ((orderSide === "buy" && orderPrice <= ticker.bid) || (orderSide === "sell" && orderPrice >= ticker.ask));
}
exports.enabledExecuteLimitOrder = enabledExecuteLimitOrder;
// その値段の指値は約定済みか
function hasExecutedLimitOrder(orderSide, orderPrice, ticker) {
    return ((orderSide === "buy" && orderPrice > ticker.bid) || (orderSide === "sell" && orderPrice < ticker.ask));
}
exports.hasExecutedLimitOrder = hasExecutedLimitOrder;
// その値段は指値範囲内か
function withinLimitOrderRange(orderSide, orderPrice, ticker, rangeRate) {
    if (0 > rangeRate || rangeRate > 1) {
        return false;
    }
    if (!enabledExecuteLimitOrder(orderSide, orderPrice, ticker)) {
        return false;
    }
    if (orderSide === "buy") {
        return orderPrice >= ticker.bid * (1 - rangeRate);
    }
    else if (orderSide === "sell") {
        return orderPrice <= ticker.ask * (1 + rangeRate);
    }
    return false;
}
exports.withinLimitOrderRange = withinLimitOrderRange;
