import { UUIDInstanceClass } from "my-utils";
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
    getOpenOrder: (pos: BasePositionClass) => BaseOrderClass;
    getCloseOrder: (pos: BasePositionClass) => BaseOrderClass;
    getLossCutOrder?: (pos: BasePositionClass) => BaseOrderClass;
    checkOpen: (pos: BasePositionClass) => boolean;
    checkClose: (pos: BasePositionClass) => boolean;
    checkLosscut?: (pos: BasePositionClass) => boolean;
    checkOpenCancel?: (pos: BasePositionClass) => boolean;
    checkCloseCancel?: (pos: BasePositionClass) => boolean;
    checkLosscutCancel?: (pos: BasePositionClass) => boolean;
}
export interface BasePositionResponse {
    success: boolean;
    message?: string;
}
export declare abstract class BasePositionClass extends UUIDInstanceClass {
    private _orderLock;
    protected _backtestMode: boolean;
    protected _closeCount: number;
    protected _cumulativeFee: number;
    protected _cumulativeProfit: number;
    protected _losscutCount: number;
    private _initialSize;
    private _currentSize;
    private _openPrice;
    private _closePrice;
    private _openOrder?;
    private _closeOrder?;
    private _losscutOrder?;
    protected _positionState: PositionStateClass;
    private _bestBid;
    private _bestAsk;
    onOpened?: (pos: BasePositionClass) => void;
    onClosed?: (pos: BasePositionClass) => void;
    onDoneLosscut?: (pos: BasePositionClass) => void;
    onOpenOrderCanceled?: (pos: BasePositionClass) => void;
    onCloseOrderCanceled?: (pos: BasePositionClass) => void;
    onLosscutOrderCanceled?: (pos: BasePositionClass) => void;
    private _checkOpen;
    private _checkClose;
    private _checkLosscut?;
    private _checkOpenCancel?;
    private _checkCloseCancel?;
    private _checkLosscutCancel?;
    private _getOpenOrder;
    private _getCloseOrder;
    private _getLosscutOrder?;
    constructor(params: BasePositionParameters);
    open(): Promise<void>;
    abstract doOpen(): Promise<string>;
    close(): Promise<void>;
    abstract doClose(): Promise<string>;
    cancel(): Promise<void>;
    abstract doCancel(): Promise<void>;
    losscut(): Promise<void>;
    updateTicker(ticker: Ticker): void;
    private updateOpenOrder;
    private updateCloseOrder;
    private updateLosscutOrder;
    private setClose;
    updateOrder(order: Order): void;
    get profit(): number;
    get unrealizedProfit(): number;
    get closeCount(): number;
    get losscutCount(): number;
    get bestBid(): number;
    set bestBid(value: number);
    get bestAsk(): number;
    set bestAsk(value: number);
    get state(): PositionStateClass;
    get currentOpenPrice(): number;
    get currentClosePrice(): number;
    get currentSize(): number;
    get openOrder(): BaseOrderClass | undefined;
    get closeOrder(): BaseOrderClass | undefined;
    get losscutOrder(): BaseOrderClass | undefined;
    private lock;
}
