"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticker_1 = require("./ticker");
test('Enabled Execute Limit Order', () => {
    const tk = {
        bid: 99.5,
        ask: 100.1,
        time: Date.now().toString()
    };
    expect((0, ticker_1.enabledExecuteLimitOrder)("buy", 99.4, tk)).toBeTruthy();
    expect((0, ticker_1.enabledExecuteLimitOrder)("sell", 100.2, tk)).toBeTruthy();
    expect((0, ticker_1.enabledExecuteLimitOrder)("buy", 99.5, tk)).toBeTruthy();
    expect((0, ticker_1.enabledExecuteLimitOrder)("sell", 100.1, tk)).toBeTruthy();
});
test('Disabled Execute Limit Order', () => {
    const tk = {
        bid: 99.5,
        ask: 100.1,
        time: Date.now().toString()
    };
    expect(!(0, ticker_1.enabledExecuteLimitOrder)("buy", 99.6, tk)).toBeTruthy();
    expect(!(0, ticker_1.enabledExecuteLimitOrder)("sell", 100.0, tk)).toBeTruthy();
});
test('has Executed Limit Order', () => {
    const tk = {
        bid: 99.5,
        ask: 100.1,
        time: Date.now().toString()
    };
    expect((0, ticker_1.hasExecutedLimitOrder)("buy", 99.6, tk)).toBeTruthy();
    expect((0, ticker_1.hasExecutedLimitOrder)("sell", 100.0, tk)).toBeTruthy();
});
test('does not have Executed Limit Order', () => {
    const tk = {
        bid: 99.5,
        ask: 100.1,
        time: Date.now().toString()
    };
    expect(!(0, ticker_1.hasExecutedLimitOrder)("buy", 99.5, tk)).toBeTruthy();
    expect(!(0, ticker_1.hasExecutedLimitOrder)("sell", 100.1, tk)).toBeTruthy();
});