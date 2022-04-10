import { MarketInfo, OrderSide, OrderType } from "./definition";
export interface BaseOrderSettings {
    clientID?: string;
    market: MarketInfo;
    type: OrderType;
    side: OrderSide;
    size: number;
    price?: number;
    postOnly?: boolean;
    cancelSec?: number;
}
export declare class BaseOrderClass {
    private _market;
    private _type;
    private _side;
    private _size;
    private _price?;
    private _postOnly;
    constructor(params: BaseOrderSettings);
    get market(): MarketInfo;
    get type(): OrderType;
    get side(): OrderSide;
    get price(): number;
    get size(): number;
    get postOnly(): boolean;
    protected roundSize(size: number): number;
    protected roundPrice(price: number): number;
}
