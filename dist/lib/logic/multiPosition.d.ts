import { OrderSide } from "../types";
export interface SinglePositionSettings {
    side: OrderSide;
    price: number;
    badget: number;
    profitRate: number;
}
export declare class SinglePositionClass {
    private _params;
    private _unit;
    private _currentPrice;
    private _cumulativeProfit;
    constructor(_params: SinglePositionSettings);
    private get isLong();
    setPrice(ask: number, bid: number): void;
    get unrealizedProfit(): number;
    get cumulativeProfit(): number;
}
export interface MultiPositionSettings {
    maxOrderSize: number;
    maxPositionSize: number;
    minPrice: number;
    maxPrice: number;
    pricePrecision: number;
    sizePrecision: number;
    badget: number;
    profitRate: number;
}
export declare class MultiPositionClass {
    private _params;
    private _positions;
    constructor(_params: MultiPositionSettings);
    setPrice(ask: number, bid: number): void;
}
