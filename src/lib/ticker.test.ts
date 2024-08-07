import {PositionOrderList, PositionStateClass, PositionStateList} from './positionState'
import { enabledExecuteLimitOrder, hasExecutedLimitOrder, withinLimitOrderRange } from './ticker'
import { OrderSide, Ticker } from './types'

test('Enabled Execute Limit Order', () => {
    const tk: Ticker = {
        bid: 99.5,
        ask: 100.1,
        timeStamp: Date.now(),
        currency: 'JPY',
        pair: '',
        exchange: 'none'
    }
    expect(enabledExecuteLimitOrder("buy", 99.4, tk)).toBeTruthy()
    expect(enabledExecuteLimitOrder("sell", 100.2, tk)).toBeTruthy()
    expect(enabledExecuteLimitOrder("buy", 99.5, tk)).toBeTruthy()
    expect(enabledExecuteLimitOrder("sell", 100.1, tk)).toBeTruthy()
})

test('Disabled Execute Limit Order', () => {
    const tk: Ticker = {
        bid: 99.5,
        ask: 100.1,
        timeStamp: Date.now(),
        currency: 'JPY',
        pair: '',
        exchange: 'none'
    }
    expect(!enabledExecuteLimitOrder("buy", 99.6, tk)).toBeTruthy()
    expect(!enabledExecuteLimitOrder("sell", 100.0, tk)).toBeTruthy()
})

test('has Executed Limit Order', () => {
    const tk: Ticker = {
        bid: 99.5,
        ask: 100.1,
        timeStamp: Date.now(),
        currency: 'JPY',
        pair: '',
        exchange: 'none'
    }
    expect(hasExecutedLimitOrder("buy", 99.6, tk)).toBeTruthy()
    expect(hasExecutedLimitOrder("sell", 100.0, tk)).toBeTruthy()
})

test('does not have Executed Limit Order', () => {
    const tk: Ticker = {
        bid: 99.5,
        ask: 100.1,
        timeStamp: Date.now(),
        currency: 'JPY',
        pair: '',
        exchange: 'none'
    }
    expect(!hasExecutedLimitOrder("buy", 99.5, tk)).toBeTruthy()
    expect(!hasExecutedLimitOrder("sell", 100.1, tk)).toBeTruthy()
})

test('within Limit Order Range', () => {
    const tk: Ticker = {
        bid: 99.5,
        ask: 100.1,
        timeStamp: Date.now(),
        currency: 'JPY',
        pair: '',
        exchange: 'none'
    }
    expect(withinLimitOrderRange("buy", 99.5, tk, 0.02)).toBeTruthy()
    expect(withinLimitOrderRange("sell", 100.1, tk, 0.02)).toBeTruthy()
    expect(withinLimitOrderRange("buy", 99, tk, 0.02)).toBeTruthy()
    expect(withinLimitOrderRange("sell", 101, tk, 0.02)).toBeTruthy()
})

test('not within Limit Order Range', () => {
    const tk: Ticker = {
        bid: 99.5,
        ask: 100.1,
        timeStamp: Date.now(),
        currency: 'JPY',
        pair: '',
        exchange: 'none'
    }
    expect(!withinLimitOrderRange("buy", 99.6, tk, 0.02)).toBeTruthy()
    expect(!withinLimitOrderRange("sell", 100.0, tk, 0.02)).toBeTruthy()
    expect(!withinLimitOrderRange("buy", 90, tk, 0.02)).toBeTruthy()
    expect(!withinLimitOrderRange("sell", 110, tk, 0.02)).toBeTruthy()
})