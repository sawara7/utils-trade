export interface BasePositionParameters {
}
export interface BasePositionResponse {
    success: boolean;
    message: string;
}
export declare class BasePositionClass {
    private _closeCount;
    private _cumulativeFee;
    private _cumulativeProfit;
    constructor(params: BasePositionParameters);
    open(): Promise<BasePositionResponse>;
    close(): Promise<BasePositionResponse>;
    get profit(): number;
    get closeCount(): number;
}
