import { OrderSide, OrderType, Ticker } from "./types";

export const MONGODB_DB_BOTSTATUS = 'botStatus'
export const MONGODB_TABLE_BOTSTATUS = 'status'
export const MONGODB_TABLE_TICKER = 'ticker'
export const MONGODB_TABLE_TICKERSTATISTICS = 'statistics'
export const MONGODB_TABLE_CUMULATIVEPL = 'cumulativePL'
export const MONGODB_TABLE_POSITIONS = 'positions'

export interface BaseBotStatus {
    botName: string
    isClear: boolean
    isStop: boolean
    isExit: boolean
    message: string
    startDate: number
    lastDate: number
}

export function getBaseBotStatus(): BaseBotStatus {
    return {
        botName: '',
        isClear: false,
        isStop: false,
        isExit: false,
        message: '-',
        startDate: Date.now(),
        lastDate: Date.now()
    }
}

export function getTickerPath(key: string): string {
    return MONGODB_TABLE_TICKER + '-' + key
}

export interface MongoPosition {
    mongoID: string
    mongoIndex: number
    openSide: OrderSide
    openSize: number
    openPrice: number
    openOrderID: string
    openOrderType: OrderType
    closePrice: number
    closeOrderType: OrderType
    closeOrderID: string
    isOpened: boolean
    isClosed: boolean
}
export type MongoPositionRefProc = (pos: MongoPosition) => void;
export type MongoPositionDict = {[id: string]: MongoPosition}

export interface CumulativePL {
    date: number;
    cumulativePL: number;
    botName: string;
}

export interface TickerStatisticsType extends Ticker {
    average: number[],
    stdv: number[],
    slope: number[],
    correlation: number[],
    sampleSize: number[]
}

export function getInitializedTickerStatistics(): TickerStatisticsType {
     return {
        ask: 0,
        bid: 0,
        currency: 'USD',
        exchange: '',
        pair: '',
        timeStamp: 0,
        average: [],
        correlation: [],
        slope: [],
        stdv: [],
        sampleSize: []
     }
}