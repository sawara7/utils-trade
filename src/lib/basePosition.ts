export interface BasePositionParameters {
    backtestMode?: boolean
}

export interface BasePositionResponse {
    success: boolean,
    message?: string
}

export abstract class BasePositionClass {
    protected _closeCount: number = 0
    protected _cumulativeFee: number = 0
    protected _cumulativeProfit: number = 0
    protected _unrealizedProfit: number = 0
    protected _backtestMode: boolean = false
    protected _losscut: boolean = false
    protected _losscutCount: number = 0

    private _orderLock: boolean = false
    private _bestBid: number = 0
    private _bestAsk: number = 0

    // Events
    public onOpened?: (pos: BasePositionClass) => void
    public onClosed?: (pos: BasePositionClass) => void
    public onLosscut?: (pos: BasePositionClass) => void
    public onOpenOrderCanceled?: (pos: BasePositionClass) => void
    public onCloseOrderCanceled?: (pos: BasePositionClass) => void
    public onLosscutOrderCanceled?: (pos: BasePositionClass) => void

    constructor(params: BasePositionParameters){
        this._backtestMode = params.backtestMode? params.backtestMode: false
    }

    public async open(): Promise<BasePositionResponse> {
        return await this.doOrder('open')
    }

    abstract doOpen(): Promise<void>

    public async close(): Promise<BasePositionResponse> {
        return await this.doOrder('close')
    }

    abstract doClose(): Promise<void>

    public async losscut(): Promise<void> {
        if (!this._losscut) {
            this._losscut = true
            await this.doLosscut()
        }
    }

    abstract doLosscut(): Promise<void>

    get enabledOpen(): boolean {
        return !this._orderLock && !this._losscut
    }

    get enabledClose(): boolean {
        return !this._orderLock && !this._losscut
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
    }

    get bestAsk(): number {
        return this._bestAsk
    }
    
    set bestAsk(value: number) {
        this._bestAsk = value
    }

    private async doOrder(side: 'open' | 'close'): Promise<BasePositionResponse> {
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
            if (side === 'open') {
                await this.doOpen()
            }
            if (side === 'close') {
                await this.doClose()
            }
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