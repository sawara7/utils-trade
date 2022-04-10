export interface BasePositionParameters {
}

export interface BasePositionResponse {
    success: boolean,
    message: string
}

export class BasePositionClass {
    private _closeCount: number = 0
    private _cumulativeFee: number = 0
    private _cumulativeProfit: number = 0

    constructor(params: BasePositionParameters){
    }

    public async open(): Promise<BasePositionResponse> {
        return {success: false, message:'Open Failed.'}
    }

    public async close(): Promise<BasePositionResponse> {
        return {success: false, message:'Close Failed.'}
    }

    get profit(): number {
        return this._cumulativeProfit - this._cumulativeFee
    }

    get closeCount(): number {
        return this._closeCount
    }
}