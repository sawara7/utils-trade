export interface BasePositionParameters {
}

export interface BasePositionResponse {
    success: boolean,
    message?: string
}

export class BasePositionClass {
    protected _closeCount: number = 0
    protected _cumulativeFee: number = 0
    protected _cumulativeProfit: number = 0

    private _orderLock: boolean = false

    constructor(params: BasePositionParameters){
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

    public async open(): Promise<BasePositionResponse> {
        return await this.doOrder('open')
    }

    protected async doOpen(): Promise<void> {}

    public async close(): Promise<BasePositionResponse> {
        return await this.doOrder('close')
    }

    protected async doClose(): Promise<void> {}

    get enabledOpen(): boolean {
        return !this._orderLock
    }

    get enabledClose(): boolean {
        return !this._orderLock
    }

    get profit(): number {
        return this._cumulativeProfit - this._cumulativeFee
    }

    get closeCount(): number {
        return this._closeCount
    }
}