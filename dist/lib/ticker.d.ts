import { BaseObjectClass } from "my-utils";
import { Ticker } from "./types";
export declare class TickerClass extends BaseObjectClass {
    private _sequenceList;
    constructor(intervalSec: number, sequenceNum: number);
    update(ticker: Ticker): void;
    get bestBid(): number | null;
    get bestAsk(): number | null;
}
