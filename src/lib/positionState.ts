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

    private validOrderID(id: string): boolean {
        return this._orderID? this._orderID === id: false
    }

    public setLosscut() {
        this._isLosscut = true
    }

    public setBeforePlaceOrder(od: PositionOrder) {
        if (this.enabledOpen && od === "open") {
            this._orderState = od
        } else if (this.enabledClose && od === "close") {
            this._orderState = od
        } else {
            throw new Error("place order error.")
        }
    }

    public setAfterPlaceOrder(id: string) {
        this._orderID = id
    }

    public setCancelOrder(id: string) {
        if (this.isNoOrder && !this.validOrderID(id)) {
            throw new Error("cancel order error.")
        }
        this._canceling = true
    }

    public setOrderClosed(id: string) {
        if (!this.isNoOrder && !this.validOrderID(id)) {
            throw new Error("order closed error.")
        }
        if (this._orderState === "open") {
            this._positionState = "opened"
        }
        if (this._orderState === "close") {
            this._positionState = "closed"
        }
        if (this._orderState === "losscut") {
            this._positionState = "closed"
            this._isLosscut = false
        }
        this._orderState = "none"
        this._orderID = undefined
    }

    public setOrderCanceled(id: string) {
        if (this.isNoOrder && !this.validOrderID(id)) {
            throw new Error("order canceled error.")
        }
        this._orderState = "none"
        this._canceling = false
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
        return !this.orderID &&
            this.orderState === "none" &&
            !this.orderCanceling
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
        return c.includes(this.positionState) && !this.isLosscut
    }
    
    public reset() {
        this._positionState = "neutral"
        this._isLosscut = false
        this._orderState = "none"
        this._canceling = false
        this._orderID = undefined
    }
}