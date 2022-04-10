
export const OrderSideList = [
    "buy",
    "sell"
  ] as const;
export type OrderSide = typeof OrderSideList[number];

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
