export interface BasePositionParameters {
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
    private _orderLock;
    private _bestBid;
    private _bestAsk;
    onOpened?: (pos: BasePositionClass) => void;
    onClosed?: (pos: BasePositionClass) => void;
    onOpenOrderCanceled?: (pos: BasePositionClass) => void;
    onCloseOrderCanceled?: (pos: BasePositionClass) => void;
    constructor(params: BasePositionParameters);
    private doOrder;
    open(): Promise<BasePositionResponse>;
    protected doOpen(): Promise<void>;
    close(): Promise<BasePositionResponse>;
    protected doClose(): Promise<void>;
    get enabledOpen(): boolean;
    get enabledClose(): boolean;
    get profit(): number;
    get unrealizedProfit(): number;
    get closeCount(): number;
    get bestBid(): number;
    set bestBid(value: number);
    get bestAsk(): number;
    set bestAsk(value: number);
}
