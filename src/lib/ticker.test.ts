import {PositionOrderList, PositionStateClass, PositionStateList} from './positionState'
import { enabledExecuteLimitOrder, hasExecutedLimitOrder } from './ticker'
import { OrderSide, Ticker } from './types'

test('Enabled Execute Limit Order', () => {
    const tk: Ticker = {
        bid: 99.5,
        ask: 100.1,
        time: Date.now().toString()
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
        time: Date.now().toString()
    }
    expect(!enabledExecuteLimitOrder("buy", 99.6, tk)).toBeTruthy()
    expect(!enabledExecuteLimitOrder("sell", 100.0, tk)).toBeTruthy()
})

test('has Executed Limit Order', () => {
    const tk: Ticker = {
        bid: 99.5,
        ask: 100.1,
        time: Date.now().toString()
    }
    expect(hasExecutedLimitOrder("buy", 99.6, tk)).toBeTruthy()
    expect(hasExecutedLimitOrder("sell", 100.0, tk)).toBeTruthy()
})

test('does not have Executed Limit Order', () => {
    const tk: Ticker = {
        bid: 99.5,
        ask: 100.1,
        time: Date.now().toString()
    }
    expect(!hasExecutedLimitOrder("buy", 99.5, tk)).toBeTruthy()
    expect(!hasExecutedLimitOrder("sell", 100.1, tk)).toBeTruthy()
})