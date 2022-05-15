export interface BasePositionParameters {
    backtestMode?: boolean;
}
export interface BasePositionResponse {
    success: boolean;
    message?: string;
}
export declare abstract class BasePositionClass {
    protected _closeCount: number;
    protected _cumulativeFee: number;
    protected _cumulativeProfit: number;
    protected _unrealizedProfit: number;
    protected _backtestMode: boolean;
    protected _losscut: boolean;
    protected _losscutCount: number;
    private _orderLock;
    private _bestBid;
    private _bestAsk;
    onOpened?: (pos: BasePositionClass) => void;
    onClosed?: (pos: BasePositionClass) => void;
    onLosscut?: (pos: BasePositionClass) => void;
    onOpenOrderCanceled?: (pos: BasePositionClass) => void;
    onCloseOrderCanceled?: (pos: BasePositionClass) => void;
    onLosscutOrderCanceled?: (pos: BasePositionClass) => void;
    constructor(params: BasePositionParameters);
    open(): Promise<BasePositionResponse>;
    abstract doOpen(): Promise<void>;
    close(): Promise<BasePositionResponse>;
    abstract doClose(): Promise<void>;
    losscut(): Promise<void>;
    abstract doLosscut(): Promise<void>;
    get enabledOpen(): boolean;
    get enabledClose(): boolean;
    get profit(): number;
    get unrealizedProfit(): number;
    get closeCount(): number;
    get losscutCount(): number;
    get bestBid(): number;
    set bestBid(value: number);
    get bestAsk(): number;
    set bestAsk(value: number);
    private doOrder;
}
