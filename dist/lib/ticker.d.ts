import { BaseObjectClass } from "my-utils";
import { OrderSide, Ticker } from "./types";
export declare class TickerClass extends BaseObjectClass {
    private _sequenceList;
    constructor(intervalSec: number, sequenceNum: number);
    update(ticker: Ticker): void;
    get bestBid(): number | null;
    get bestAsk(): number | null;
}
export declare function enabledExecuteLimitOrder(orderSide: OrderSide, orderPrice: number, ticker: Ticker): boolean;
export declare function hasExecutedLimitOrder(orderSide: OrderSide, orderPrice: number, ticker: Ticker): boolean;
export declare function withinLimitOrderRange(orderSide: OrderSide, orderPrice: number, ticker: Ticker, rangeRate: number): boolean;
