export const PositionStateList = [
    "neutral",
    "opened",
    "closed"
  ] as const
export type PositionState = typeof PositionStateList[number]

export const PositionOrderList = [
    "none",
    "open",
    "close",
    "losscut"
  ] as const
export type PositionOrder = typeof PositionOrderList[number]

export class PositionStateClass {
    private _isLosscut: boolean = false
    private _positionState: PositionState = "neutral"
    private _orderState: PositionOrder = "none"
    private _canceling: boolean = false
    private _orderID: string | undefined

    public setLosscut() {
        this._isLosscut = true
    }

    public setBeforePlaceOrder(od: PositionOrder) {
        if (this.enabledOpen && od === "open") {
            this._orderState = "open"
        } else if (this.enabledClose && od === "close") {
            this._orderState = "close"
        } else if (this.enabledClose && od === "losscut" && this.isLosscut) {
            this._orderState = "losscut"
        } else {
            throw new Error("place order error.")
        }
    }

    public setAfterPlaceOrder(id: string) {
        if (this._orderID) {
            throw new Error("set after place order error.")
        }
        this._orderID = id
    }

    public setCancelOrder() {
        if (this.isNoOrder) {
            throw new Error("cancel order error.")
        }
        this._canceling = true
    }

    public setOrderClosed() {
        if (this.isNoOrder) {
            throw new Error("order closed error.")
        }
        if (this._canceling) {
            this._canceling = false
        } else if (this._orderState === "open") {
            this._positionState = "opened"
        } else if (this._orderState === "close") {
            this._positionState = "closed"
        } else if (this._orderState === "losscut") {
            this._positionState = "closed"
            this._isLosscut = false
        }
        this._orderState = "none"
        this._orderID = undefined
    }

    get isLosscut(): boolean {
        return this._isLosscut
    }

    get positionState(): PositionState {
        return this._positionState
    } 

    get orderState(): PositionOrder {
        return this._orderState
    }

    get orderCanceling(): boolean {
        return this._canceling
    }

    get orderID(): string | undefined{
        return this._orderID
    }

    get isNoOrder(): boolean {
        return !this.orderID && this.orderState === "none" && !this.orderCanceling
    }

    get enabledOpen(): boolean {
        const c: PositionState[] = ["neutral", "closed"]
        return c.includes(this.positionState) && this.isNoOrder
    }

    get enabledClose(): boolean {
        const c: PositionState[] = ["opened"]
        return c.includes(this.positionState) && this.isNoOrder
    }

    get enabledLosscut(): boolean {
        const c: PositionState[] = ["opened"]
        return c.includes(this.positionState) && !this.isLosscut && this.isNoOrder
    }

    get enabledCancel(): boolean {
        return this.orderState !== "none" &&
        !!this.orderID &&
        !this.orderCanceling
    }
    
    public reset() {
        this._positionState = "neutral"
        this._isLosscut = false
        this._orderState = "none"
        this._canceling = false
        this._orderID = undefined
    }
}