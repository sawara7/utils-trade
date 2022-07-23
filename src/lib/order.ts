import {
    BaseObjectClass
} from "my-utils"

import {
    MarketInfo,
    OrderSide,
    OrderType
} from "./types"

export interface BaseOrderSettings {
    clientID?: string
    market: MarketInfo
    type: OrderType
    side: OrderSide
    size: number
    price?: number
    postOnly?: boolean
}

export interface BaseOrderVariables {
    _clientID: string
    _market: MarketInfo
    _type: OrderType
    _side: OrderSide
    _size: number
    _price?: number
    _postOnly: boolean
}

export class BaseOrderClass extends BaseObjectClass {
    private _clientID: string
    private _market: MarketInfo
    private _type: OrderType
    private _side: OrderSide
    private _size: number
    private _price?: number
    private _postOnly: boolean

    constructor (params?: BaseOrderSettings) {
        super()
        this._clientID = params && params.clientID? params.clientID: ''
        this._market = params? params.market: {
            name: '',
            type: 'spot',
            crossOrder: false,
            sizeResolution: 0,
            priceResolution: 0,
            minOrderSize: 0
        }
        this._type = params? params.type: 'limit'
        this._side = params? params.side: 'buy'
        this._size = params? params.size: 0
        this._price = params? params.price: 0
        this._postOnly = params && params.postOnly? true: false
    }

    public import(jsn: any) {
        super.import(jsn)
        const v = jsn as BaseOrderVariables
        this._clientID = v._clientID
        this._market = v._market
        this._type = v._type
        this._side = v._side
        this._size = v._size
        this._price = v._price
        this._postOnly = v._postOnly
    }

    public export(): any {
        const v = super.export() as BaseOrderVariables
        v._clientID = this._clientID
        v._market = this._market
        v._type = this._type
        v._side = this._side
        v._size = this._size
        v._price = this._price
        v._postOnly = this._postOnly
        return v
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
        return Math.floor(size * (1/this.market.sizeResolution))/(1/this.market.sizeResolution)
    }

    public roundPrice(price: number): number {
        if (this._side === "buy") {
            return Math.floor(price * (1/this.market.priceResolution))/(1/this.market.priceResolution)
        } else {
            return Math.round(price * (1/this.market.priceResolution))/(1/this.market.priceResolution)
        }
    }
}