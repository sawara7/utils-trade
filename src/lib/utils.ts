import { OrderSide, Ticker } from "./types"

export function getUnrealizedPL(openSide: OrderSide, ticker: Ticker, openPrice: number, openSize: number): number {
    let unrealized = 0
    if (openSide === "buy") {
        unrealized = (ticker.bid - openPrice) * openSize
    }
    if (openSide === "sell") {
        unrealized = (openPrice - ticker.bid) * openSize
    }
    return unrealized
}
