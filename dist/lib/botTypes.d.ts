import { OrderSide, OrderType, Ticker } from "./types";
export declare const MONGODB_DB_BOTSTATUS = "botStatus";
export declare const MONGODB_TABLE_BOTSTATUS = "status";
export declare const MONGODB_TABLE_TICKER = "ticker";
export declare const MONGODB_TABLE_TICKERSTATISTICS = "statistics";
export declare const MONGODB_TABLE_CUMULATIVEPL = "cumulativePL";
export declare const MONGODB_TABLE_POSITIONS = "positions";
export interface BaseBotStatus {
    botName: string;
    isClear: boolean;
    isStop: boolean;
    isExit: boolean;
    message: string;
    startDate: number;
    lastDate: number;
    dbName: string;
}
export declare function getBaseBotStatus(): BaseBotStatus;
export declare function getTickerPath(key: string): string;
export interface MongoPosition {
    mongoID: string;
    mongoIndex: number;
    openSide: OrderSide;
    openSize: number;
    openPrice: number;
    openOrderID: string;
    openOrderType: OrderType;
    closePrice: number;
    closeOrderType: OrderType;
    closeOrderID: string;
    isOpened: boolean;
    isClosed: boolean;
}
export type MongoPositionRefProc = (pos: MongoPosition) => void;
export type MongoPositionDict = {
    [id: string]: MongoPosition;
};
export interface CumulativePL {
    date: number;
    cumulativePL: number;
    botName: string;
}
export interface TickerStatisticsType extends Ticker {
    average: number[];
    stdv: number[];
    slope: number[];
    correlation: number[];
    sampleSize: number[];
}
export declare function getInitializedTickerStatistics(): TickerStatisticsType;
