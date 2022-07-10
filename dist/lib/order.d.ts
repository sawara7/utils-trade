import { UUIDInstanceClass } from "my-utils";
import { MarketInfo, OrderSide, OrderType } from "./definition";
export interface BaseOrderSettings {
    clientID?: string;
    market: MarketInfo;
    type: OrderType;
    side: OrderSide;
    size: number;
    price?: number;
    postOnly?: boolean;
}
export declare class BaseOrderClass extends UUIDInstanceClass {
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
    roundSize(size: number): number;
    roundPrice(price: number): number;
}
