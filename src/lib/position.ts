import { MarketInfo, OrderSide, OrderType } from ".."
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
    status: string
    filledSize: number
    remainingSize: number
    avgFillPrice: number
}

export interface BasePositionParameters {
    backtestMode?: boolean
    marketInfo: MarketInfo
    openSide: OrderSide
    orderType: OrderType
    funds: number
    openPrice: number
    closePrice: number
    losscutPrice?: number
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
    private _marketInfo: MarketInfo
    private _openSide: OrderSide
    private _initialSize: number = 0
    private _currentSize: number = 0
    private _openPrice: number = 0
    private _closePrice: number = 0
    private _losscutPrice?: number

    protected _positionState: PositionStateClass

    private _orderLock: boolean = false
    private _bestBid: number = 0
    private _bestAsk: number = 0

    // Events
    public onOpened?: (pos: BasePositionClass) => void
    public onClosed?: (pos: BasePositionClass) => void
    public onOpenOrderCanceled?: (pos: BasePositionClass) => void
    public onCloseOrderCanceled?: (pos: BasePositionClass) => void

    // Conditions
    public checkOpen?: (pos: BasePositionClass) => boolean
    public checkClose?: (pos: BasePositionClass) => boolean
    public checkOpenCancel?: (pos: BasePositionClass) => boolean
    public checkCloseCancel?: (pos: BasePositionClass) => boolean
    public checkLosscut?: (pos: BasePositionClass) => boolean

    constructor(params: BasePositionParameters){
        this._positionState = new PositionStateClass()
        this._backtestMode = params.backtestMode? params.backtestMode: false
        this._marketInfo = params.marketInfo
        this._openSide = params.openSide
    }

    public async open(): Promise<BasePositionResponse> {
        return await this.lock(async()=>{
            this.state.setBeforePlaceOrder("open")
            const id = await this.doOpen()
            this.state.setAfterPlaceOrder(id)
        })
    }

    abstract doOpen(): Promise<string>

    public async close(): Promise<BasePositionResponse> {
        return await this.lock(async()=>{
            this.state.setBeforePlaceOrder("close")
            const id = await this.doClose()
            this.state.setAfterPlaceOrder(id)
        })
    }

    abstract doClose(): Promise<string>

    public async cancel(): Promise<BasePositionResponse> {
        return await this.lock(async()=>{
            await this.doCancel()
        })
    }

    abstract doCancel(): Promise<void>

    public async losscut(): Promise<void> {
        if (!this._positionState.enabledLosscut) {
            this._positionState.setLosscut()
            await this.doLosscut()
        }
    }

    abstract doLosscut(): Promise<void>

    public updateTicker(ticker: Ticker) {
        this.bestAsk = ticker.ask
        this.bestBid = ticker.bid
        if (this.state.enabledCancel && (
            (this.checkOpenCancel && this.checkOpenCancel(this)) ||
            (this.checkCloseCancel && this.checkCloseCancel(this))
        )){
            this.cancel()
        } else if (this.state.enabledLosscut && this.checkLosscut && this.checkLosscut(this)){
            this.losscut()
        } else if (this.state.enabledOpen && this.checkOpen && this.checkOpen(this)) {
            this.open()
        } else if (this.state.enabledClose && this.checkClose && this.checkClose(this)) {
            this.close()
        }
    }

    public updateOrder(order: Order) {
        if (order.status !== 'closed') { return }
        if (order.orderID !== this.state.orderID) { return }
        const size = this._marketInfo.roundSize(order.size)
        const filled = this._marketInfo.roundSize(order.filledSize)
        if (filled > 0) {
            if (this.state.orderState === "open") {
                this._currentSize = filled
                this._initialSize = filled
                this._openPrice = this._marketInfo.roundPrice(order.avgFillPrice? order.avgFillPrice: order.price)
            }
            if (this.state.orderState === "close") {
                this._currentSize = this._marketInfo.roundSize(this._currentSize - filled)
                this._closePrice = this._marketInfo.roundPrice(order.avgFillPrice? order.avgFillPrice: order.price)
            }
        }
        if (filled !== size) {
            if (this.state.orderState === "open") {
                this.state.setOrderClosed()
                if (this.onOpenOrderCanceled) {
                    this.onOpenOrderCanceled(this)
                }
            }
            if (this.state.orderState === "close") {
                this.state.setOrderClosed()
                if (this.onCloseOrderCanceled){
                    this.onCloseOrderCanceled(this)
                }
            }
        }
        if (filled === size) {
            if (this.state.orderState === "open") {
                this.state.setOrderClosed()
                if (this.onOpened){
                    this.onOpened(this)
                }
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

    set bestBid(value: number) {
        this._bestBid = value
        if (this._currentSize > 0 && this._openSide === 'buy') {
            this._unrealizedProfit = (value - this._openPrice) * this._currentSize
        }
    }

    get bestAsk(): number {
        return this._bestAsk
    }

    set bestAsk(value: number) {
        this._bestAsk = value
        if (this._currentSize > 0 && this._openSide === 'sell') {
            this._unrealizedProfit = (this._openPrice - value) * this._currentSize
        }
    }

    get state(): PositionStateClass {
        return this._positionState
    }

    get losscutPrice(): number | undefined {
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

    private async lock(cb: ()=>Promise<void>): Promise<BasePositionResponse> {
        const res: BasePositionResponse = {
            success: true    
        }
        if (this._orderLock) {
            return {
                success: false,
                message: 'Open Locked'
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