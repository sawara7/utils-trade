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
const positionState_1 = require("./positionState");
class BasePositionClass {
    constructor(params) {
        this._backtestMode = false;
        this._closeCount = 0;
        this._cumulativeFee = 0;
        this._cumulativeProfit = 0;
        this._unrealizedProfit = 0;
        this._losscutCount = 0;
        this._initialSize = 0;
        this._currentSize = 0;
        this._openPrice = 0;
        this._closePrice = 0;
        this._orderLock = false;
        this._bestBid = 0;
        this._bestAsk = 0;
        this._positionState = new positionState_1.PositionStateClass();
        this._backtestMode = params.backtestMode ? params.backtestMode : false;
        this._marketInfo = params.marketInfo;
        this._openSide = params.openSide;
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lock(() => __awaiter(this, void 0, void 0, function* () {
                this.state.setBeforePlaceOrder("open");
                const id = yield this.doOpen();
                this.state.setAfterPlaceOrder(id);
            }));
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lock(() => __awaiter(this, void 0, void 0, function* () {
                this.state.setBeforePlaceOrder("close");
                const id = yield this.doClose();
                this.state.setAfterPlaceOrder(id);
            }));
        });
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lock(() => __awaiter(this, void 0, void 0, function* () {
                yield this.doCancel();
            }));
        });
    }
    losscut() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._positionState.enabledLosscut) {
                this._positionState.setLosscut();
                yield this.doLosscut();
            }
        });
    }
    updateTicker(ticker) {
        this.bestAsk = ticker.ask;
        this.bestBid = ticker.bid;
        if (this.state.enabledCancel && ((this.checkOpenCancel && this.checkOpenCancel(this)) ||
            (this.checkCloseCancel && this.checkCloseCancel(this)))) {
            this.cancel();
        }
        else if (this.state.enabledLosscut && this.checkLosscut && this.checkLosscut(this)) {
            this.losscut();
        }
        else if (this.state.enabledOpen && this.checkOpen && this.checkOpen(this)) {
            this.open();
        }
        else if (this.state.enabledClose && this.checkClose && this.checkClose(this)) {
            this.close();
        }
    }
    updateOrder(order) {
        if (order.status !== 'closed') {
            return;
        }
        if (order.orderID !== this.state.orderID) {
            return;
        }
        const size = this._marketInfo.roundSize(order.size);
        const filled = this._marketInfo.roundSize(order.filledSize);
        if (filled > 0) {
            if (this.state.orderState === "open") {
                this._currentSize = filled;
                this._initialSize = filled;
                this._openPrice = this._marketInfo.roundPrice(order.avgFillPrice ? order.avgFillPrice : order.price);
            }
            if (this.state.orderState === "close") {
                this._currentSize = this._marketInfo.roundSize(this._currentSize - filled);
                this._closePrice = this._marketInfo.roundPrice(order.avgFillPrice ? order.avgFillPrice : order.price);
            }
        }
        if (filled !== size) {
            if (this.state.orderState === "open") {
                this.state.setOrderClosed();
                if (this.onOpenOrderCanceled) {
                    this.onOpenOrderCanceled(this);
                }
            }
            if (this.state.orderState === "close") {
                this.state.setOrderClosed();
                if (this.onCloseOrderCanceled) {
                    this.onCloseOrderCanceled(this);
                }
            }
        }
        if (filled === size) {
            if (this.state.orderState === "open") {
                this.state.setOrderClosed();
                if (this.onOpened) {
                    this.onOpened(this);
                }
            }
            if (["losscut", "close"].includes(this.state.orderState)) {
                if (this.state.isLosscut) {
                    this._losscutCount++;
                }
                this._cumulativeProfit += this._initialSize *
                    (this._openSide === 'buy' ? (this._closePrice - this._openPrice) : (this._openPrice - this._closePrice));
                this._initialSize = 0;
                this._currentSize = 0;
                this._unrealizedProfit = 0;
                this._closeCount++;
                this.state.setOrderClosed();
                if (this.onClosed) {
                    this.onClosed(this);
                }
            }
        }
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
        if (this._currentSize > 0 && this._openSide === 'buy') {
            this._unrealizedProfit = (value - this._openPrice) * this._currentSize;
        }
    }
    get bestAsk() {
        return this._bestAsk;
    }
    set bestAsk(value) {
        this._bestAsk = value;
        if (this._currentSize > 0 && this._openSide === 'sell') {
            this._unrealizedProfit = (this._openPrice - value) * this._currentSize;
        }
    }
    get state() {
        return this._positionState;
    }
    get losscutPrice() {
        return this._losscutPrice;
    }
    get currentOpenPrice() {
        return this._openPrice;
    }
    get currentClosePrice() {
        return this._closePrice;
    }
    get currentSize() {
        return this._currentSize;
    }
    lock(cb) {
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
                yield cb();
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
