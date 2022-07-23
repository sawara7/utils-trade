import { BaseObjectClass } from "my-utils";
import { MarketInfo, OrderSide, OrderType } from "./types";
export interface BaseOrderSettings {
    clientID?: string;
    market: MarketInfo;
    type: OrderType;
    side: OrderSide;
    size: number;
    price?: number;
    postOnly?: boolean;
}
export interface BaseOrderVariables {
    _clientID: string;
    _market: MarketInfo;
    _type: OrderType;
    _side: OrderSide;
    _size: number;
    _price?: number;
    _postOnly: boolean;
}
export declare class BaseOrderClass extends BaseObjectClass {
    private _clientID;
    private _market;
    private _type;
    private _side;
    private _size;
    private _price?;
    private _postOnly;
    constructor(params?: BaseOrderSettings);
    import(jsn: any): void;
    export(): any;
    get market(): MarketInfo;
    get type(): OrderType;
    get side(): OrderSide;
    get price(): number;
    get size(): number;
    get postOnly(): boolean;
    roundSize(size: number): number;
    roundPrice(price: number): number;
}
