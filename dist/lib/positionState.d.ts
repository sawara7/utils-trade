export declare const PositionStateList: readonly ["neutral", "opened", "closed"];
export declare type PositionState = typeof PositionStateList[number];
export declare const PositionOrderList: readonly ["none", "open", "close", "losscut"];
export declare type PositionOrder = typeof PositionOrderList[number];
export interface PositionStateVariables {
    isLosscut: boolean;
    positionState: PositionState;
    orderState: PositionOrder;
    orderStateTime: {
        [s: string]: number;
    };
    canceling: boolean;
    orderID: string | undefined;
}
export declare class PositionStateClass {
    private _isLosscut;
    private _positionState;
    private _orderState;
    private _orderStateTime;
    private _canceling;
    private _orderID;
    import(value: PositionStateVariables): void;
    export(): PositionStateVariables;
    setLosscut(): void;
    setBeforePlaceOrder(od: PositionOrder): void;
    setAfterPlaceOrder(id: string): void;
    setCancelOrder(): void;
    setOrderClosed(): void;
    setOrderCanceled(): void;
    setOrderFailed(): void;
    setOrderCancelFailed(): void;
    get isLosscut(): boolean;
    get positionState(): PositionState;
    get orderState(): PositionOrder;
    private set orderState(value);
    getOrderStateTime(s: PositionOrder): number | undefined;
    get orderCanceling(): boolean;
    get orderID(): string | undefined;
    get isNoOrder(): boolean;
    get enabledOpen(): boolean;
    get enabledClose(): boolean;
    get enabledLosscut(): boolean;
    get enabledOpenOrderCancel(): boolean;
    get enabledCloseOrderCancel(): boolean;
    reset(): void;
}
