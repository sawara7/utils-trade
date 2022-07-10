"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerClass = void 0;
const my_utils_1 = require("my-utils");
class TickerClass extends my_utils_1.UUIDInstanceClass {
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
