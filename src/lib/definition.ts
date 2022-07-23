export const TickerTypeList = [
  "ask",
  "bid"
] as const;
export type TickerType = typeof TickerTypeList[number];

export const OrderSideList = [
    "buy",
    "sell"
  ] as const;
export type OrderSide = typeof OrderSideList[number];

export function getCloseSide(openSide: OrderSide): OrderSide {
  return openSide === "buy"? "sell": "buy"
}

export const OrderTypeList = [
    "limit",
    "market"
  ] as const;
export type OrderType = typeof OrderTypeList[number];

export const MarketTypeList = [
    "spot",
    "future"
  ] as const;
export type MarketType = typeof MarketTypeList[number];

export interface MarketInfo {
    name: string
    type: MarketType
    crossOrder: boolean
    sizeResolution: number
    priceResolution: number
    minOrderSize: number
}
