import { BaseOrderClass, OrderSide } from ".."
import { PositionStateClass } from "./positionState"

export interface Ticker {
    time: string
    bid: number
    ask: number
}

export interface Order {
    orderID: string
    clientId?: string
    market: string
    type: string
    side: string
    size: number
    price: number
    status: "closed" | string
    filledSize: number
    remainingSize: number
    avgFillPrice: number
}

export interface BasePositionParameters {
    backtestMode?: boolean
    losscutPrice: number
    openOrder: BaseOrderClass
    closeOrder: BaseOrderClass
    checkOpen: (pos: BasePositionClass) => boolean
    checkClose: (pos: BasePositionClass) => boolean
    checkOpenCancel?: (pos: BasePositionClass) => boolean
    checkCloseCancel?: (pos: BasePositionClass) => boolean
    checkLosscut?: (pos: BasePositionClass) => boolean
}

export interface BasePositionResponse {
    success: boolean,
    message?: string
}

export abstract class BasePositionClass {
    protected _backtestMode: boolean = false

    protected _closeCount: number = 0
    protected _cumulativeFee: number = 0
    protected _cumulativeProfit: number = 0
    protected _unrealizedProfit: number = 0
    protected _losscutCount: number = 0

    // Position
    private _initialSize: number = 0
    private _currentSize: number = 0
    private _losscutPrice: number = 0
    private _openSide: OrderSide
    private _openPrice: number = 0
    private _closePrice: number = 0

    // Order
    private _openOrder: BaseOrderClass
    private _closeOrder: BaseOrderClass

    protected _positionState: PositionStateClass

    private _orderLock: boolean = false
    private _bestBid: number = 0
    private _previousBid: number = 0
    private _bestAsk: number = 0
    private _previousAsk: number = 0
    private _ema100Bid: number = 0
    private _ema100Ask: number = 0
    private _ema1000Bid: number = 0
    private _ema1000Ask: number = 0

    // Events
    public onOpened?: (pos: BasePositionClass) => void
    public onClosed?: (pos: BasePositionClass) => void
    public onOpenOrderCanceled?: (pos: BasePositionClass) => void
    public onCloseOrderCanceled?: (pos: BasePositionClass) => void

    // Conditions
    private _checkOpen?: (pos: BasePositionClass) => boolean
    private _checkClose?: (pos: BasePositionClass) => boolean
    private _checkOpenCancel?: (pos: BasePositionClass) => boolean
    private _checkCloseCancel?: (pos: BasePositionClass) => boolean
    private _checkLosscut?: (pos: BasePositionClass) => boolean

    constructor(params: BasePositionParameters){
        this._positionState = new PositionStateClass()
        this._backtestMode = params.backtestMode? params.backtestMode: false
        this._openOrder = params.openOrder
        this._closeOrder = params.closeOrder
        this._openSide = params.openOrder.side
        this._losscutPrice = params.losscutPrice
        this._checkOpen = params.checkOpen
        this._checkClose = params.checkClose
        this._checkCloseCancel = params.checkCloseCancel
        this._checkOpenCancel = params.checkOpenCancel
        this._checkLosscut = params.checkLosscut
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
            (this.state.enabledCloseOrderCancel && this._checkCloseCancel && this._checkCloseCancel(this))
        ){
            console.log(this.currentOpenPrice, this.state.positionState, 'cancel')
            this.cancel()
        } else if (this.state.enabledOpen && this._checkOpen && this._checkOpen(this)) {
            console.log(this.currentOpenPrice, 'open')
            this.open()
        } else if (this.state.enabledClose && this._checkClose && this._checkClose(this)) {
            console.log(this.currentOpenPrice, 'close')
            this.close()
        } else if (this.state.enabledLosscut && this._checkLosscut && this._checkLosscut(this)) {
            console.log(this.currentOpenPrice, 'losscut')
            this.losscut()
        }
    }

    public updateOrder(order: Order) {
        if (order.status !== 'closed') { return }
        if (order.orderID !== this.state.orderID) { return }
        const size = this.state.orderState === "open"? this._openOrder.roundSize(order.size): this._closeOrder.roundSize(order.size)
        const filled = this.state.orderState === "open"? this._openOrder.roundSize(order.filledSize): this._closeOrder.roundSize(order.filledSize)
        if (filled > 0) {
            if (this.state.orderState === "open") {
                this._currentSize = filled
                this._initialSize = filled
                this._openPrice = this._openOrder.roundPrice(order.avgFillPrice? order.avgFillPrice: order.price)
            }
            if (["close", "losscut"].includes(this.state.orderState)) {
                this._currentSize = this._closeOrder.roundSize(this._currentSize - filled)
                this._closePrice = this._closeOrder.roundPrice(order.avgFillPrice? order.avgFillPrice: order.price)
            }
        }
        if (filled !== size) {
            if (this.state.orderState === "open") {
                this.state.setOrderCanceled()
                if (this.onOpenOrderCanceled) {
                    this.onOpenOrderCanceled(this)
                }
                return
            }
            
            if (this.state.orderState === "losscut") {
                return
            }

            if (this.state.orderState === "close") {
                this.state.setOrderCanceled()
                if (this.state.isLosscut) {
                    // this.close()
                }
                if (this.onCloseOrderCanceled){
                    this.onCloseOrderCanceled(this)
                }
                return
            }
        }
        if (filled === size) {
            if (this.state.orderState === "open") {
                this.state.setOrderClosed()
                if (this.onOpened){
                    this.onOpened(this)
                }
                return
            }

            if (["losscut", "close"].includes(this.state.orderState)) {
                if (this.state.isLosscut) {
                    this._losscutCount++
                }
                this._cumulativeProfit += this._initialSize * 
                    (this._openSide === 'buy' ? (this._closePrice - this._openPrice): (this._openPrice - this._closePrice))
                this._initialSize = 0
                this._currentSize = 0
                this._unrealizedProfit = 0
                this._closeCount++
                this.state.setOrderClosed()
                if (this.onClosed){
                    this.onClosed(this)
                }
                return
            }
        }
    }

    get profit(): number {
        return this._cumulativeProfit - this._cumulativeFee
    }

    get unrealizedProfit(): number {
        return this._unrealizedProfit
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

    get previousBid(): number {
        return this._previousBid
    }

    get emaBid100(): number {
        return this._ema100Bid
    }

    get emaBid1000(): number {
        return this._ema1000Bid
    }

    set bestBid(value: number) {
        this._previousBid = this._bestBid
        this._bestBid = value
        this._ema100Bid = this._ema100Bid * (1-1/100) + value * 1/100
        this._ema1000Bid = this._ema1000Bid * (1-1/1000) + value * 1/1000
        if (this._currentSize > 0 && this._openSide === 'buy') {
            this._unrealizedProfit = (value - this._openPrice) * this._currentSize
        }
    }

    get bestAsk(): number {
        return this._bestAsk
    }

    get previousAsk(): number {
        return this._previousAsk
    }

    get emaAsk100(): number {
        return this._ema100Ask
    }

    get emaAsk1000(): number {
        return this._ema1000Ask
    }

    set bestAsk(value: number) {
        this._previousAsk = this._bestAsk
        this._bestAsk = value
        this._ema100Ask = this._ema100Ask * (1-1/100) + value * 1/100
        this._ema1000Ask = this._ema1000Ask * (1-1/1000) + value * 1/1000
        if (this._currentSize > 0 && this._openSide === 'sell') {
            this._unrealizedProfit = (this._openPrice - value) * this._currentSize
        }
    }

    get state(): PositionStateClass {
        return this._positionState
    }

    get losscutPrice(): number {
        return this._losscutPrice
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

    get openOrder(): BaseOrderClass {
        return this._openOrder
    }

    get closeOrder(): BaseOrderClass {
        return this._closeOrder
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