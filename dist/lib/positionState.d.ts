export declare const PositionStateList: readonly ["neutral", "opened", "closed"];
export declare type PositionState = typeof PositionStateList[number];
export declare const PositionOrderList: readonly ["none", "open", "close", "losscut"];
export declare type PositionOrder = typeof PositionOrderList[number];
export declare class PositionStateClass {
    private _isLosscut;
    private _positionState;
    private _orderState;
    private _canceling;
    private _orderID;
    setLosscut(): void;
    setBeforePlaceOrder(od: PositionOrder): void;
    setAfterPlaceOrder(id: string): void;
    setCancelOrder(): void;
    setOrderClosed(): void;
    setOrderFailed(): void;
    setOrderCancelFailed(): void;
    get isLosscut(): boolean;
    get positionState(): PositionState;
    get orderState(): PositionOrder;
    get orderCanceling(): boolean;
    get orderID(): string | undefined;
    get isNoOrder(): boolean;
    get enabledOpen(): boolean;
    get enabledClose(): boolean;
    get enabledLosscut(): boolean;
    get enabledCancel(): boolean;
    reset(): void;
}
