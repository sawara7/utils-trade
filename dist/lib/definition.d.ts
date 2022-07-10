export declare const TickerTypeList: readonly ["ask", "bid"];
export declare type TickerType = typeof TickerTypeList[number];
export declare const OrderSideList: readonly ["buy", "sell"];
export declare type OrderSide = typeof OrderSideList[number];
export declare const OrderTypeList: readonly ["limit", "market"];
export declare type OrderType = typeof OrderTypeList[number];
export declare const MarketTypeList: readonly ["spot", "future"];
export declare type MarketType = typeof MarketTypeList[number];
export interface MarketInfo {
    name: string;
    type: MarketType;
    crossOrder: boolean;
    sizeResolution: number;
    priceResolution: number;
    minOrderSize: number;
}
