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
        // Position
        this._initialSize = 0;
        this._currentSize = 0;
        this._losscutPrice = 0;
        this._openPrice = 0;
        this._closePrice = 0;
        this._orderLock = false;
        this._bestBid = 0;
        this._previousBid = 0;
        this._bestAsk = 0;
        this._previousAsk = 0;
        this._ema100Bid = 0;
        this._ema100Ask = 0;
        this._ema1000Bid = 0;
        this._ema1000Ask = 0;
        this._minBid = 0;
        this._minAsk = 0;
        this._maxBid = 0;
        this._maxAsk = 0;
        this._positionState = new positionState_1.PositionStateClass();
        this._backtestMode = params.backtestMode ? params.backtestMode : false;
        this._openOrder = params.openOrder;
        this._closeOrder = params.closeOrder;
        this._openSide = params.openOrder.side;
        this._losscutPrice = params.losscutPrice;
        this._checkOpen = params.checkOpen;
        this._checkClose = params.checkClose;
        this._checkCloseCancel = params.checkCloseCancel;
        this._checkOpenCancel = params.checkOpenCancel;
        this._checkLosscut = params.checkLosscut;
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.lock(() => __awaiter(this, void 0, void 0, function* () {
                this.state.setBeforePlaceOrder("open");
                const id = yield this.doOpen();
                this.state.setAfterPlaceOrder(id);
            }));
            if (!res.success) {
                console.log("[open error]" + res.message);
                this.state.setOrderFailed();
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.lock(() => __awaiter(this, void 0, void 0, function* () {
                this.state.setBeforePlaceOrder(this.state.isLosscut ? "losscut" : "close");
                const id = yield this.doClose();
                this.state.setAfterPlaceOrder(id);
            }));
            if (!res.success) {
                console.log("[closer error]" + res.message);
                this.state.setOrderFailed();
            }
        });
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.lock(() => __awaiter(this, void 0, void 0, function* () {
                this._positionState.setCancelOrder();
                yield this.doCancel();
            }));
            if (!res.success) {
                console.log("[cancel error]" + res.message);
                this.state.setOrderCancelFailed();
            }
        });
    }
    losscut() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._positionState.enabledLosscut) {
                if (!this.state.isNoOrder && !this.state.orderCanceling) {
                    this._positionState.setLosscut();
                    yield this.cancel();
                }
            }
        });
    }
    updateTicker(ticker) {
        this.bestAsk = ticker.ask;
        this.bestBid = ticker.bid;
        if ((this.state.enabledOpenOrderCancel && this._checkOpenCancel && this._checkOpenCancel(this)) ||
            (this.state.enabledCloseOrderCancel && this._checkCloseCancel && this._checkCloseCancel(this))) {
            console.log(this.currentOpenPrice, this.state.positionState, 'cancel');
            this.cancel();
        }
        else if (this.state.enabledOpen && this._checkOpen && this._checkOpen(this)) {
            console.log(this.currentOpenPrice, 'open');
            this.open();
        }
        else if (this.state.enabledClose && this._checkClose && this._checkClose(this)) {
            console.log(this.currentOpenPrice, 'close');
            this.close();
        }
        else if (this.state.enabledLosscut && this._checkLosscut && this._checkLosscut(this)) {
            console.log(this.currentOpenPrice, 'losscut');
            this.losscut();
        }
    }
    updateOrder(order) {
        if (order.status !== 'closed') {
            return;
        }
        if (order.orderID !== this.state.orderID) {
            return;
        }
        const size = this.state.orderState === "open" ? this._openOrder.roundSize(order.size) : this._closeOrder.roundSize(order.size);
        const filled = this.state.orderState === "open" ? this._openOrder.roundSize(order.filledSize) : this._closeOrder.roundSize(order.filledSize);
        if (filled > 0) {
            if (this.state.orderState === "open") {
                this._currentSize = filled;
                this._initialSize = filled;
                this._openPrice = this._openOrder.roundPrice(order.avgFillPrice ? order.avgFillPrice : order.price);
            }
            if (["close", "losscut"].includes(this.state.orderState)) {
                this._currentSize = this._closeOrder.roundSize(this._currentSize - filled);
                this._closePrice = this._closeOrder.roundPrice(order.avgFillPrice ? order.avgFillPrice : order.price);
            }
        }
        if (filled !== size) {
            if (this.state.orderState === "open") {
                this.state.setOrderCanceled();
                if (this.onOpenOrderCanceled) {
                    this.onOpenOrderCanceled(this);
                }
                return;
            }
            if (this.state.orderState === "losscut") {
                return;
            }
            if (this.state.orderState === "close") {
                this.state.setOrderCanceled();
                if (this.state.isLosscut) {
                    // this.close()
                }
                if (this.onCloseOrderCanceled) {
                    this.onCloseOrderCanceled(this);
                }
                return;
            }
        }
        if (filled === size) {
            if (this.state.orderState === "open") {
                this.state.setOrderClosed();
                if (this.onOpened) {
                    this.onOpened(this);
                }
                return;
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
                return;
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
    get previousBid() {
        return this._previousBid;
    }
    get emaBid100() {
        return this._ema100Bid;
    }
    get emaBid1000() {
        return this._ema1000Bid;
    }
    get maxBid() {
        return this._maxBid;
    }
    get minBid() {
        return this._minBid;
    }
    set bestBid(value) {
        this._previousBid = this._bestBid;
        this._bestBid = value;
        this._ema100Bid = this._ema100Bid * (1 - 1 / 100) + value * 1 / 100;
        this._ema1000Bid = this._ema1000Bid * (1 - 1 / 1000) + value * 1 / 1000;
        if (this._positionState.positionState === "opened") {
            this._minBid = this._minBid > value ? value : this._minBid;
            this._maxBid = this._maxBid < value ? value : this._maxBid;
        }
        else {
            this._minBid = value;
            this._maxBid = value;
        }
        if (this._currentSize > 0 && this._openSide === 'buy') {
            this._unrealizedProfit = (value - this._openPrice) * this._currentSize;
        }
    }
    get bestAsk() {
        return this._bestAsk;
    }
    get previousAsk() {
        return this._previousAsk;
    }
    get emaAsk100() {
        return this._ema100Ask;
    }
    get emaAsk1000() {
        return this._ema1000Ask;
    }
    get maxAsk() {
        return this._maxAsk;
    }
    get minAsk() {
        return this._minAsk;
    }
    set bestAsk(value) {
        this._previousAsk = this._bestAsk;
        this._bestAsk = value;
        this._ema100Ask = this._ema100Ask * (1 - 1 / 100) + value * 1 / 100;
        this._ema1000Ask = this._ema1000Ask * (1 - 1 / 1000) + value * 1 / 1000;
        if (this._positionState.positionState === "opened") {
            this._minAsk = this._minAsk > value ? value : this._minAsk;
            this._maxAsk = this._maxAsk < value ? value : this._maxAsk;
        }
        else {
            this._minAsk = value;
            this._maxAsk = value;
        }
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
    get openOrder() {
        return this._openOrder;
    }
    get closeOrder() {
        return this._closeOrder;
    }
    lock(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = {
                success: true
            };
            if (this._orderLock) {
                return {
                    success: false,
                    message: 'Order Locked'
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
