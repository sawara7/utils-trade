"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiPositionClass = exports.SinglePositionClass = void 0;
class SinglePositionClass {
    constructor(_params) {
        this._params = _params;
        this._unit = 0;
        this._currentPrice = 0;
        this._cumulativeProfit = 0;
    }
    get isLong() {
        return this._params.side === "buy";
    }
    setPrice(ask, bid) {
        if (this.isLong) {
            this._currentPrice = ask;
            if (this._currentPrice > this._params.price && this._unit === 0) {
                // open
                this._unit = this._params.badget / this._params.price;
            }
            if (this._currentPrice > this._params.price * (1 + this._params.profitRate) && this._unit > 0) {
                // close
                this._unit === 0;
            }
        }
        else {
            this._currentPrice = bid;
            if (this._currentPrice < this._params.price && this._unit === 0) {
                // open
                this._unit = this._params.badget / this._params.price;
            }
            if (this._currentPrice < this._params.price * (1 - this._params.profitRate) && this._unit > 0) {
                // close
                this._unit === 0;
            }
        }
    }
    get unrealizedProfit() {
        const diff = this.isLong ?
            this._currentPrice - this._params.price :
            this._params.price - this._currentPrice;
        return diff * this._unit;
    }
    get cumulativeProfit() {
        return this._cumulativeProfit;
    }
}
exports.SinglePositionClass = SinglePositionClass;
class MultiPositionClass {
    constructor(_params) {
        this._params = _params;
        this._positions = [];
    }
    setPrice(ask, bid) {
        for (const p of this._positions) {
            p.setPrice(ask, bid);
        }
    }
}
exports.MultiPositionClass = MultiPositionClass;
