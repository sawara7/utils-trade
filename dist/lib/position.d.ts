import { BaseOrderClass } from "..";
import { PositionStateClass } from "./positionState";
export interface Ticker {
    time: string;
    bid: number;
    ask: number;
}
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
export interface BasePositionParameters {
    backtestMode?: boolean;
    losscutPrice: number;
    openOrder: BaseOrderClass;
    closeOrder: BaseOrderClass;
    checkOpen: (pos: BasePositionClass) => boolean;
    checkClose: (pos: BasePositionClass) => boolean;
    checkOpenCancel?: (pos: BasePositionClass) => boolean;
    checkCloseCancel?: (pos: BasePositionClass) => boolean;
    checkLosscut?: (pos: BasePositionClass) => boolean;
}
export interface BasePositionResponse {
    success: boolean;
    message?: string;
}
export declare abstract class BasePositionClass {
    protected _backtestMode: boolean;
    protected _closeCount: number;
    protected _cumulativeFee: number;
    protected _cumulativeProfit: number;
    protected _unrealizedProfit: number;
    protected _losscutCount: number;
    private _initialSize;
    private _currentSize;
    private _losscutPrice;
    private _openSide;
    private _openPrice;
    private _closePrice;
    private _openOrder;
    private _closeOrder;
    protected _positionState: PositionStateClass;
    private _orderLock;
    private _bestBid;
    private _previousBid;
    private _bestAsk;
    private _previousAsk;
    private _ema100Bid;
    private _ema100Ask;
    private _ema1000Bid;
    private _ema1000Ask;
    onOpened?: (pos: BasePositionClass) => void;
    onClosed?: (pos: BasePositionClass) => void;
    onOpenOrderCanceled?: (pos: BasePositionClass) => void;
    onCloseOrderCanceled?: (pos: BasePositionClass) => void;
    private _checkOpen?;
    private _checkClose?;
    private _checkOpenCancel?;
    private _checkCloseCancel?;
    private _checkLosscut?;
    constructor(params: BasePositionParameters);
    open(): Promise<void>;
    abstract doOpen(): Promise<string>;
    close(): Promise<void>;
    abstract doClose(): Promise<string>;
    cancel(): Promise<void>;
    abstract doCancel(): Promise<void>;
    losscut(): Promise<void>;
    updateTicker(ticker: Ticker): void;
    updateOrder(order: Order): void;
    get profit(): number;
    get unrealizedProfit(): number;
    get closeCount(): number;
    get losscutCount(): number;
    get bestBid(): number;
    get previousBid(): number;
    get emaBid100(): number;
    get emaBid1000(): number;
    set bestBid(value: number);
    get bestAsk(): number;
    get previousAsk(): number;
    get emaAsk100(): number;
    get emaAsk1000(): number;
    set bestAsk(value: number);
    get state(): PositionStateClass;
    get losscutPrice(): number;
    get currentOpenPrice(): number;
    get currentClosePrice(): number;
    get currentSize(): number;
    get openOrder(): BaseOrderClass;
    get closeOrder(): BaseOrderClass;
    private lock;
}
