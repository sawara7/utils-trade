import { UUIDInstanceClass } from "my-utils";
import { Ticker } from "./position";
export declare class TickerClass extends UUIDInstanceClass {
    private _sequenceList;
    constructor(intervalSec: number, sequenceNum: number);
    update(ticker: Ticker): void;
    get bestBid(): number | null;
    get bestAsk(): number | null;
}
