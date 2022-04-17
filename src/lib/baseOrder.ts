import {
    MarketInfo,
    OrderSide,
    OrderType
} from "./definition"

export interface BaseOrderSettings {
    clientID?: string
    market: MarketInfo
    type: OrderType
    side: OrderSide
    size: number
    price?: number
    postOnly?: boolean
    cancelSec?: number
}

export class BaseOrderClass {
    private _market: MarketInfo
    private _type: OrderType
    private _side: OrderSide
    private _size: number
    private _price?: number
    private _postOnly: boolean

    constructor (params: BaseOrderSettings) {
        this._market = params.market
        this._type = params.type
        this._side = params.side
        this._size = params.size
        this._price = params.price
        this._postOnly = params.postOnly? true: false
    }

    get market(): MarketInfo {
        return this._market
    }

    get type(): OrderType {
        return this._type
    }

    get side(): OrderSide {
        return this._side
    }

    get price(): number {
        if (!this._price) {
            throw Error()
        }
        return this.roundPrice(this._price)
    }

    get size(): number {
        return this.roundSize(this._size)
    }

    get postOnly(): boolean {
        return this._postOnly
    }

    public roundSize(size: number): number {
        return Math.round(size * (1/this.market.sizeResolution))/(1/this.market.sizeResolution)
    }

    public roundPrice(price: number): number {
        return Math.round(price * (1/this.market.priceResolution))/(1/this.market.priceResolution)
    }
}