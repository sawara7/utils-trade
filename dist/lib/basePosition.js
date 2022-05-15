"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePositionClass = void 0;
class BasePositionClass {
    constructor(params) {
        this._closeCount = 0;
        this._cumulativeFee = 0;
        this._cumulativeProfit = 0;
        this._unrealizedProfit = 0;
        this._backtestMode = false;
        this._losscut = false;
        this._losscutCount = 0;
        this._orderLock = false;
        this._bestBid = 0;
        this._bestAsk = 0;
        this._backtestMode = params.backtestMode ? params.backtestMode : false;
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doOrder('open');
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doOrder('close');
        });
    }
    losscut() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._losscut) {
                this._losscut = true;
                yield this.doLosscut();
            }
        });
    }
    get enabledOpen() {
        return !this._orderLock && !this._losscut;
    }
    get enabledClose() {
        return !this._orderLock && !this._losscut;
    }
    get profit() {
        return this._cumulativeProfit - this._cumulativeFee;
    }
    get unrealizedProfit() {
        return this._unrealizedProfit;
    }
    get closeCount() {
        return this._closeCount;
    }
    get losscutCount() {
        return this._losscutCount;
    }
    get bestBid() {
        return this._bestBid;
    }
    set bestBid(value) {
        this._bestBid = value;
    }
    get bestAsk() {
        return this._bestAsk;
    }
    set bestAsk(value) {
        this._bestAsk = value;
    }
    doOrder(side) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = {
                success: true
            };
            if (this._orderLock) {
                return {
                    success: false,
                    message: 'Open Locked'
                };
            }
            try {
                this._orderLock = true;
                if (side === 'open') {
                    yield this.doOpen();
                }
                if (side === 'close') {
                    yield this.doClose();
                }
            }
            catch (e) {
                res.success = false;
                if (e instanceof Error) {
                    res.message = e.message;
                }
            }
            finally {
                this._orderLock = false;
            }
            return res;
        });
    }
}
exports.BasePositionClass = BasePositionClass;
