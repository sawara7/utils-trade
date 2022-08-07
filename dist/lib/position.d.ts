import { BaseObjectClass } from "my-utils";
import { BaseOrderClass, BaseOrderVariables, Order, Ticker } from "..";
import { PositionStateClass, PositionStateVariables } from "./positionState";
export interface BasePositionParameters {
    backtestMode?: boolean;
    enabledOrderUpdate: boolean;
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
export interface BasePositionVariables {
    _orderLock: boolean;
    _backtestMode: boolean;
    _closeCount: number;
    _cumulativeFee: number;
    _cumulativeProfit: number;
    _losscutCount: number;
    _initialSize: number;
    _currentSize: number;
    _openPrice: number;
    _closePrice: number;
    _openOrder?: BaseOrderVariables;
    _closeOrder?: BaseOrderVariables;
    _losscutOrder?: BaseOrderVariables;
    _positionState: PositionStateVariables;
    _ticker: Ticker;
}
export interface BasePositionResponse {
    success: boolean;
    message?: string;
}
export declare abstract class BasePositionClass extends BaseObjectClass {
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
    protected _enabledOrderUpdate: boolean;
    protected _positionState: PositionStateClass;
    private _ticker;
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
    import(jsn: any): void;
    export(): any;
    open(): Promise<void>;
    abstract doOpen(): Promise<string>;
    close(): Promise<void>;
    abstract doClose(): Promise<string>;
    cancel(): Promise<void>;
    abstract doCancel(): Promise<void>;
    losscut(): Promise<void>;
    updateTicker(ticker: Ticker): Promise<void>;
    private updateOpenOrder;
    private updateCloseOrder;
    private updateLosscutOrder;
    private setOpen;
    private setClose;
    updateOrder(order: Order): void;
    get profit(): number;
    get unrealizedProfit(): number;
    get closeCount(): number;
    get losscutCount(): number;
    get bestBid(): number;
    get bestAsk(): number;
    get state(): PositionStateClass;
    get currentOpenPrice(): number;
    get currentClosePrice(): number;
    get currentSize(): number;
    get openOrder(): BaseOrderClass | undefined;
    get closeOrder(): BaseOrderClass | undefined;
    get losscutOrder(): BaseOrderClass | undefined;
    private lock;
}
