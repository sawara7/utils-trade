export declare const botCurrencyList: readonly ["JPY", "USD"];
export type botCurrency = typeof botCurrencyList[number];
export declare const botExchangeList: string[];
export type botExchange = typeof botExchangeList[number];
export declare const TickerTypeList: readonly ["ask", "bid"];
export type TickerType = typeof TickerTypeList[number];
export declare const OrderSideList: readonly ["buy", "sell"];
export type OrderSide = typeof OrderSideList[number];
export declare function getCloseSide(openSide: OrderSide): OrderSide;
export type ListByOrderSide<T> = {
    [orderSide: string]: T;
};
export declare function getListByOrderSide<T>(value: (s: OrderSide) => T): ListByOrderSide<T>;
export declare const OrderTypeList: readonly ["limit", "market"];
export type OrderType = typeof OrderTypeList[number];
export declare const MarketTypeList: readonly ["spot", "future"];
export type MarketType = typeof MarketTypeList[number];
export interface MarketInfo {
    name: string;
    type: MarketType;
    crossOrder: boolean;
    sizeResolution: number;
    priceResolution: number;
    minOrderSize: number;
}
export interface Ticker {
    timeStamp: number;
    bid: number;
    ask: number;
    currency: botCurrency;
    pair: string;
    exchange: botExchange;
}
export declare function getDefaultTicker(): Ticker;
export interface Order {
    orderID: string;
    clientId?: string;
    market: string;
    type: string;
    side: string;
    size: number;
    price: number;
    status: "closed" | string;
    filledSize: number;
    remainingSize: number;
    avgFillPrice: number;
}
