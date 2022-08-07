import { SequenceList, SequenceListType, BaseObjectClass } from "my-utils"
import { OrderSide, Ticker } from "./types"

export class TickerClass extends BaseObjectClass {
    private _sequenceList: SequenceList

    constructor(intervalSec: number, sequenceNum: number) {
        super()
        this._sequenceList = new SequenceList(intervalSec, sequenceNum)
    }

    public update(ticker: Ticker) {
        const tk: SequenceListType = {
            ask: ticker.ask,
            bid: ticker.bid,
            timestamp: Date.now()
        }
        this._sequenceList.push(tk)
    }

    get bestBid(): number | null {
        return this._sequenceList.lastValue("bid")
    }

    get bestAsk(): number | null {
        return this._sequenceList.lastValue("ask")
    }
}

// その値段で指値注文可能か
export function enabledExecuteLimitOrder(orderSide: OrderSide, orderPrice: number, ticker: Ticker): boolean {
    return ((orderSide === "buy" && orderPrice <= ticker.bid) || (orderSide === "sell" && orderPrice >= ticker.ask))
}

// その値段の指値は約定済みか
export function hasExecutedLimitOrder(orderSide: OrderSide, orderPrice: number, ticker: Ticker): boolean {
    return ((orderSide === "buy" && orderPrice > ticker.bid) || (orderSide === "sell" && orderPrice < ticker.ask))
}