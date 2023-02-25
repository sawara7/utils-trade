import { OrderSide } from "../types"

export interface SinglePositionSettings {
    side: OrderSide
    price: number
    badget: number
    profitRate: number
}

export class SinglePositionClass {
    private _unit: number = 0
    private _currentPrice: number = 0
    private _cumulativeProfit: number = 0

    constructor (private _params: SinglePositionSettings) {
    }

    private get isLong(): boolean {
        return this._params.side === "buy"
    }

    public setPrice(ask: number, bid: number) {
        if (this.isLong) {
            this._currentPrice = ask
            if (this._currentPrice > this._params.price && this._unit === 0) {
                // open
                this._unit = this._params.badget / this._params.price
            }
            if (this._currentPrice > this._params.price * (1+this._params.profitRate) && this._unit > 0) {
                // close
                this._unit === 0
            }
        } else {
            this._currentPrice = bid
            if (this._currentPrice < this._params.price && this._unit === 0) {
                // open
                this._unit = this._params.badget / this._params.price
            }
            if (this._currentPrice < this._params.price * (1-this._params.profitRate) && this._unit > 0) {
                // close
                this._unit === 0
            }
        }
    }

    get unrealizedProfit(): number {
        const diff = this.isLong? 
            this._currentPrice - this._params.price:
            this._params.price - this._currentPrice
        return diff * this._unit
    }

    get cumulativeProfit(): number {
        return this._cumulativeProfit
    }
}


export interface MultiPositionSettings {
    maxOrderSize: number
    maxPositionSize: number
    minPrice: number
    maxPrice: number
    pricePrecision: number
    sizePrecision: number
    badget: number
    profitRate: number
}

export class MultiPositionClass {
    private _positions: SinglePositionClass[] = []

    constructor (private _params: MultiPositionSettings) {
    }

    public setPrice(ask: number, bid: number) {
        for (const p of this._positions) {
            p.setPrice(ask, bid)
        }
    }
}