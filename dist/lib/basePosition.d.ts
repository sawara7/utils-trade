export interface BasePositionParameters {
}
export interface BasePositionResponse {
    success: boolean;
    message?: string;
}
export declare class BasePositionClass {
    protected _closeCount: number;
    protected _cumulativeFee: number;
    protected _cumulativeProfit: number;
    private _orderLock;
    constructor(params: BasePositionParameters);
    private doOrder;
    open(): Promise<BasePositionResponse>;
    protected doOpen(): Promise<void>;
    close(): Promise<BasePositionResponse>;
    protected doClose(): Promise<void>;
    get enabledOpen(): boolean;
    get enabledClose(): boolean;
    get profit(): number;
    get closeCount(): number;
}
