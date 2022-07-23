import { BaseObjectClass } from "my-utils"
import { BaseOrderClass, BaseOrderVariables, Order, Ticker } from ".."
import { PositionStateClass, PositionStateVariables } from "./positionState"

export interface BasePositionParameters {
    backtestMode?: boolean
    getOpenOrder: (pos: BasePositionClass) => BaseOrderClass
    getCloseOrder: (pos: BasePositionClass) => BaseOrderClass
    getLossCutOrder?: (pos: BasePositionClass) => BaseOrderClass
    checkOpen: (pos: BasePositionClass) => boolean
    checkClose: (pos: BasePositionClass) => boolean
    checkLosscut?: (pos: BasePositionClass) => boolean
    checkOpenCancel?: (pos: BasePositionClass) => boolean
    checkCloseCancel?: (pos: BasePositionClass) => boolean
    checkLosscutCancel?: (pos: BasePositionClass) => boolean
}

export interface BasePositionVariables {
    _orderLock: boolean
    _backtestMode: boolean
    _closeCount: number
    _cumulativeFee: number
    _cumulativeProfit: number
    _losscutCount: number
    _initialSize: number
    _currentSize: number
    _openPrice: number
    _closePrice: number
    _openOrder?: BaseOrderVariables
    _closeOrder?: BaseOrderVariables
    _losscutOrder?: BaseOrderVariables
    _positionState: PositionStateVariables
    _bestBid: number
    _bestAsk: number
}

export interface BasePositionResponse {
    success: boolean,
    message?: string
}

export abstract class BasePositionClass extends BaseObjectClass {
    private _orderLock: boolean = false

    protected _backtestMode: boolean = false

    protected _closeCount: number = 0
    protected _cumulativeFee: number = 0
    protected _cumulativeProfit: number = 0
    protected _losscutCount: number = 0

    // Position
    private _initialSize: number = 0
    private _currentSize: number = 0

    private _openPrice: number = 0
    private _closePrice: number = 0

    // Order
    private _openOrder?: BaseOrderClass
    private _closeOrder?: BaseOrderClass
    private _losscutOrder?: BaseOrderClass

    protected _positionState: PositionStateClass

    private _bestBid: number = 0
    private _bestAsk: number = 0

    // Events
    public onOpened?: (pos: BasePositionClass) => void
    public onClosed?: (pos: BasePositionClass) => void
    public onDoneLosscut?: (pos: BasePositionClass) => void

    public onOpenOrderCanceled?: (pos: BasePositionClass) => void
    public onCloseOrderCanceled?: (pos: BasePositionClass) => void
    public onLosscutOrderCanceled?: (pos: BasePositionClass) => void

    // Conditions
    private _checkOpen: (pos: BasePositionClass) => boolean
    private _checkClose: (pos: BasePositionClass) => boolean
    private _checkLosscut?: (pos: BasePositionClass) => boolean

    private _checkOpenCancel?: (pos: BasePositionClass) => boolean
    private _checkCloseCancel?: (pos: BasePositionClass) => boolean
    private _checkLosscutCancel?: (pos: BasePositionClass) => boolean

    // getOrder
    private _getOpenOrder: (pos: BasePositionClass) => BaseOrderClass
    private _getCloseOrder: (pos: BasePositionClass) => BaseOrderClass
    private _getLosscutOrder?: (pos: BasePositionClass) => BaseOrderClass

    constructor(params: BasePositionParameters) {
        super()
        this._positionState = new PositionStateClass()
        this._backtestMode = params.backtestMode? params.backtestMode: false

        this._getOpenOrder = params.getOpenOrder
        this._getCloseOrder = params.getCloseOrder
        this._getLosscutOrder = params.getLossCutOrder
        
        this._checkOpen = params.checkOpen
        this._checkClose = params.checkClose
        this._checkLosscut = params.checkLosscut
        
        this._checkCloseCancel = params.checkCloseCancel
        this._checkOpenCancel = params.checkOpenCancel
        this._checkLosscutCancel = params.checkLosscutCancel
    }

    public import(jsn: any) {
        super.import(jsn)
        const v = jsn as BasePositionVariables
        this._orderLock = v._orderLock
        this._backtestMode = v._backtestMode
        this._closeCount = v._closeCount
        this._cumulativeFee = v._cumulativeFee
        this._cumulativeProfit = v._cumulativeProfit
        this._losscutCount = v._losscutCount
        this._initialSize = v._initialSize
        this._currentSize = v._currentSize
        this._openPrice = v._openPrice
        this._closePrice = v._closeCount
        if (v._openOrder) {
            this._openOrder = new BaseOrderClass()
            this._openOrder.import(v._openOrder)
        }
        if (v._closeOrder) {
            this._closeOrder = new BaseOrderClass()
            this._closeOrder.import(v._closeOrder)
        }
        if (v._losscutOrder) {
            this._losscutOrder = new BaseOrderClass()
            this._losscutOrder.import(v._losscutOrder)
        }
        this._positionState.import(v._positionState)
        this._bestBid = v._bestBid
        this._bestAsk = v._bestAsk
    }

    public export(): any {
        const v = super.export() as BasePositionVariables
        v._orderLock = this._orderLock 
        v._backtestMode = this._backtestMode
        v._closeCount = this._closeCount
        v._cumulativeFee = this._cumulativeFee
        v._cumulativeProfit = this._cumulativeProfit
        v._losscutCount = this._losscutCount
        v._initialSize = this._initialSize
        v._currentSize = this._currentSize
        v._openPrice = this._openPrice
        v._closePrice = this._closeCount
        if (this._openOrder) {
            v._openOrder = this._openOrder.export()
        }
        if (this._closeOrder) {
            v._closeOrder = this._closeOrder.export()
        }
        if (this._losscutOrder) {
            v._losscutOrder = this._losscutOrder.export()
        }
        v._positionState = this._positionState.export() 
        v._bestBid = this._bestBid
        v._bestAsk = this._bestAsk
        return v
    }

    public async open(): Promise<void> {
        const res = await this.lock(async()=>{
            this.state.setBeforePlaceOrder("open")
            const id = await this.doOpen()
            this.state.setAfterPlaceOrder(id)
        })
        if (!res.success) {
            console.log("[open error]" + res.message)
            this.state.setOrderFailed()
        }
    }

    abstract doOpen(): Promise<string>

    public async close(): Promise<void> {
        const res = await this.lock(async()=>{
            this.state.setBeforePlaceOrder(this.state.isLosscut? "losscut": "close")
            const id = await this.doClose()
            this.state.setAfterPlaceOrder(id)
        })
        if (!res.success) {
            console.log("[closer error]" + res.message)
            this.state.setOrderFailed()
        }
    }

    abstract doClose(): Promise<string>

    public async cancel(): Promise<void> {
        const res = await this.lock(async()=>{
            this._positionState.setCancelOrder()
            await this.doCancel()
        })
        if (!res.success) {
            console.log("[cancel error]" + res.message)
            this.state.setOrderCancelFailed()
        }
    }

    abstract doCancel(): Promise<void>

    public async losscut(): Promise<void> {
        if (this._positionState.enabledLosscut) {
            if (!this.state.isNoOrder && !this.state.orderCanceling) {
                this._positionState.setLosscut()
                await this.cancel()
            }
        }
    }

    public updateTicker(ticker: Ticker) {
        this.bestAsk = ticker.ask
        this.bestBid = ticker.bid
        if ((this.state.enabledOpenOrderCancel && this._checkOpenCancel && this._checkOpenCancel(this)) ||
            (this.state.enabledCloseOrderCancel && this._checkCloseCancel && this._checkCloseCancel(this) ||
            (this.state.enabledCloseOrderCancel && this._checkLosscutCancel && this._checkLosscutCancel(this)))
        ){
            console.log(this.currentOpenPrice, this.state.positionState, 'cancel')
            this.cancel()
        } else if (this.state.enabledOpen && this._checkOpen(this)) {
            console.log(this.currentOpenPrice, 'open')
            this._openOrder = this._getOpenOrder(this)
            this.open()
        } else if (this.state.enabledClose && this._checkClose(this)) {
            console.log(this.currentOpenPrice, 'close')
            this._closeOrder = this._getCloseOrder(this)
            this.close()
        } else if (this.state.enabledLosscut && this._checkLosscut && this._getLosscutOrder && this._checkLosscut(this)) {
            console.log(this.currentOpenPrice, 'losscut')
            this._losscutOrder = this._getLosscutOrder(this)
            this.losscut()
        }
    }

    private updateOpenOrder(order: Order) {
        if (!this._openOrder) { return }
        const size = this._openOrder.roundSize(order.size)
        const filled = this._openOrder.roundSize(order.filledSize)
        if (filled > 0) {
            this._currentSize = filled
            this._initialSize = filled
            this._openPrice = this._openOrder.roundPrice(order.avgFillPrice? order.avgFillPrice: order.price)
        }
        if (filled !== size) {
            this.state.setOrderCanceled()
            if (this.onOpenOrderCanceled) {
                this.onOpenOrderCanceled(this)
            }
            return
        }
        if (filled === size) {
            this.state.setOrderClosed()
            if (this.onOpened){
                this.onOpened(this)
            }
            return
        }
    }

    private updateCloseOrder(order: Order) {
        if (!this._closeOrder || !this._openOrder) { return }
        const size = this._closeOrder.roundSize(order.size)
        const filled = this._closeOrder.roundSize(order.filledSize)
        if (filled > 0) {
            if (["close", "losscut"].includes(this.state.orderState)) {
                this._currentSize = this._closeOrder.roundSize(this._currentSize - filled)
                this._closePrice = this._closeOrder.roundPrice(order.avgFillPrice? order.avgFillPrice: order.price)
            }
        }
        if (filled !== size) {
            this.state.setOrderCanceled()
            if (this.onCloseOrderCanceled){
                this.onCloseOrderCanceled(this)
            }
            return
        }
        if (filled === size) {this.setClose()}
    }

    private updateLosscutOrder(order: Order) {
        if (!this._losscutOrder || !this._openOrder) { return }
        const size = this._losscutOrder.roundSize(order.size)
        const filled = this._losscutOrder.roundSize(order.filledSize)
        if (filled > 0) {
            this._currentSize = this._losscutOrder.roundSize(this._currentSize - filled)
            this._closePrice = this._losscutOrder.roundPrice(order.avgFillPrice? order.avgFillPrice: order.price)
        }
        if (filled !== size) {
            this.state.setOrderCanceled()
            if (this.onLosscutOrderCanceled){
                this.onLosscutOrderCanceled(this)
            }
            return
        }
        if (filled === size) {
            if (this.state.isLosscut) {
                this._losscutCount++
                if (this.onDoneLosscut){
                    this.onDoneLosscut(this)
                }
            }
            this.setClose()
        }
    }

    private setClose() {
        if (!this._openOrder) { return }
        this._cumulativeProfit += this._initialSize * 
        (this._openOrder.side === 'buy' ? (this._closePrice - this._openPrice): (this._openPrice - this._closePrice))
        this._initialSize = 0
        this._currentSize = 0
        this._closeCount++
        this.state.setOrderClosed()
        if (this.onClosed){
            this.onClosed(this)
        }
    }

    public updateOrder(order: Order) {
        if (order.status !== 'closed') { return }
        if (order.orderID !== this.state.orderID) { return }
        if (this.state.orderState === "open") {
            this.updateOpenOrder(order)
        } else if (this.state.orderState === "close") {
            this.updateCloseOrder(order)
        } else if (this.state.orderState === "losscut") {
            this.updateLosscutOrder(order)
        }
    }

    get profit(): number {
        return this._cumulativeProfit - this._cumulativeFee
    }

    get unrealizedProfit(): number {
        let result = 0
        if (this._openOrder && this._currentSize > 0) {
            if (this._openOrder.side === 'buy') {
                result = (this.bestBid - this._openPrice) * this._currentSize
            } else {
                result = (this._openPrice - this.bestAsk) * this._currentSize
            }
        }
        return result
    }

    get closeCount(): number {
        return this._closeCount
    }

    get losscutCount(): number {
        return this._losscutCount
    }
    
    get bestBid(): number {
        return this._bestBid
    }

    set bestBid(value: number) {
        this._bestBid = value
    }

    get bestAsk(): number {
        return this._bestAsk
    }

    set bestAsk(value: number) {
        this._bestAsk = value
    }

    get state(): PositionStateClass {
        return this._positionState
    }

    get currentOpenPrice(): number {
        return this._openPrice
    }

    get currentClosePrice(): number {
        return this._closePrice
    }

    get currentSize(): number {
        return this._currentSize
    }

    get openOrder(): BaseOrderClass | undefined {
        return this._openOrder
    }

    get closeOrder(): BaseOrderClass | undefined {
        return this._closeOrder
    }

    get losscutOrder(): BaseOrderClass | undefined {
        return this._losscutOrder
    }

    private async lock(cb: ()=>Promise<void>): Promise<BasePositionResponse> {
        const res: BasePositionResponse = {
            success: true    
        }
        if (this._orderLock) {
            return {
                success: false,
                message: 'Order Locked'
            }
        }
        try {
            this._orderLock = true
            await cb()
        } catch(e) {
            res.success = false
            if (e instanceof Error) {
                res.message = e.message
            }
        } finally {
            this._orderLock = false
        }
        return res
    }
}