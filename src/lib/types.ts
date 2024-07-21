export const botCurrencyList = [
  'JPY',
  'USD'
  ] as const;
export type botCurrency = typeof botCurrencyList[number]

export const botExchangeList = [
  'none',
  'bybit',
  'oanda',
  'bitbank',
  'gmo'
]
export type botExchange = typeof botExchangeList[number]

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

export type ListByOrderSide<T> = {[orderSide: string]: T}

export function getListByOrderSide<T>(value: (s: OrderSide)=>T): ListByOrderSide<T> {
  const res: ListByOrderSide<T> = {}
  for (const s of OrderSideList) {
    res[s] = value(s)
  }
  return res
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

export interface Ticker {
  timeStamp: number
  bid: number
  ask: number
  currency: botCurrency
  pair: string
  exchange: botExchange
}

export function getDefaultTicker(): Ticker {
  return {
      ask: 0,
      bid: 0,
      timeStamp: 0,
      currency: 'JPY',
      pair: '',
      exchange: 'none'
  }
}

export interface Order {
  orderID: string
  clientId?: string
  market: string
  type: string
  side: string
  size: number
  price: number
  status: "closed" | string
  filledSize: number
  remainingSize: number
  avgFillPrice: number
}