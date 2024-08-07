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
const utils_general_1 = require("utils-general");
const __1 = require("..");
const positionState_1 = require("./positionState");
class BasePositionClass extends utils_general_1.BaseObjectClass {
    constructor(params) {
        super();
        this._orderLock = false;
        this._backtestMode = false;
        this._closeCount = 0;
        this._cumulativeFee = 0;
        this._cumulativeProfit = 0;
        this._losscutCount = 0;
        // Position
        this._initialSize = 0;
        this._currentSize = 0;
        this._openPrice = 0;
        this._closePrice = 0;
        this._enabledOrderUpdate = false;
        this._ticker = (0, __1.getDefaultTicker)();
        this._positionState = new positionState_1.PositionStateClass();
        this._backtestMode = params.backtestMode ? params.backtestMode : false;
        this._enabledOrderUpdate = params.enabledOrderUpdate;
        this._getOpenOrder = params.getOpenOrder;
        this._getCloseOrder = params.getCloseOrder;
        this._getLosscutOrder = params.getLossCutOrder;
        this._checkOpen = params.checkOpen;
        this._checkClose = params.checkClose;
        this._checkLosscut = params.checkLosscut;
        this._checkCloseCancel = params.checkCloseCancel;
        this._checkOpenCancel = params.checkOpenCancel;
        this._checkLosscutCancel = params.checkLosscutCancel;
    }
    import(jsn) {
        super.import(jsn);
        const v = jsn;
        this._orderLock = v._orderLock;
        this._backtestMode = v._backtestMode;
        this._closeCount = v._closeCount;
        this._cumulativeFee = v._cumulativeFee;
        this._cumulativeProfit = v._cumulativeProfit;
        this._losscutCount = v._losscutCount;
        this._initialSize = v._initialSize;
        this._currentSize = v._currentSize;
        this._openPrice = v._openPrice;
        this._closePrice = v._closeCount;
        if (v._openOrder) {
            this._openOrder = new __1.BaseOrderClass();
            this._openOrder.import(v._openOrder);
        }
        if (v._closeOrder) {
            this._closeOrder = new __1.BaseOrderClass();
            this._closeOrder.import(v._closeOrder);
        }
        if (v._losscutOrder) {
            this._losscutOrder = new __1.BaseOrderClass();
            this._losscutOrder.import(v._losscutOrder);
        }
        this._positionState.import(v._positionState);
        this._ticker = v._ticker;
    }
    export() {
        const v = super.export();
        v._orderLock = this._orderLock;
        v._backtestMode = this._backtestMode;
        v._closeCount = this._closeCount;
        v._cumulativeFee = this._cumulativeFee;
        v._cumulativeProfit = this._cumulativeProfit;
        v._losscutCount = this._losscutCount;
        v._initialSize = this._initialSize;
        v._currentSize = this._currentSize;
        v._openPrice = this._openPrice;
        v._closePrice = this._closeCount;
        if (this._openOrder) {
            v._openOrder = this._openOrder.export();
        }
        if (this._closeOrder) {
            v._closeOrder = this._closeOrder.export();
        }
        if (this._losscutOrder) {
            v._losscutOrder = this._losscutOrder.export();
        }
        v._positionState = this._positionState.export();
        v._ticker = this._ticker;
        return v;
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.lock(() => __awaiter(this, void 0, void 0, function* () {
                this.state.setBeforePlaceOrder("open");
                const id = yield this.doOpen();
                this.state.setAfterPlaceOrder(id);
            }));
            if (!res.success) {
                console.log("[open error]" + res.message, this.openOrder);
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
                console.log("[close error]" + res.message, this.closeOrder);
                this.state.setOrderFailed();
            }
        });
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.lock(() => __awaiter(this, void 0, void 0, function* () {
                this._positionState.setCancelOrder();
                yield this.doCancel();
                if (!this._enabledOrderUpdate) {
                    this.state.setOrderCanceled();
                }
            }));
            if (!res.success) {
                console.log("[cancel error]" + res.message);
                this.state.setOrderCancelFailed();
                this.state.setOrderFailed();
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
        return __awaiter(this, void 0, void 0, function* () {
            this._ticker = ticker;
            if (this.state.enabledCloseOrderCancel && this._closeOrder
                && (0, __1.hasExecutedLimitOrder)(this._closeOrder.side, this._closeOrder.price, this._ticker)) {
                console.log("set close");
                this._currentSize = 0;
                this._closePrice = this._closeOrder.price;
                this.setClose();
                return;
            }
            if (this.state.enabledOpenOrderCancel && this._openOrder
                && (0, __1.hasExecutedLimitOrder)(this._openOrder.side, this._openOrder.price, this._ticker)) {
                console.log("set open");
                this.setOpen(this._openOrder.size, this._openOrder.price);
                return;
            }
            if (this.state.enabledOpenOrderCancel && this._checkOpenCancel && this._checkOpenCancel(this)) {
                yield this.cancel();
                return;
            }
            if ((this.state.enabledCloseOrderCancel && this._checkCloseCancel && this._checkCloseCancel(this))) {
                yield this.cancel();
                return;
            }
            if ((this.state.enabledCloseOrderCancel && this._checkLosscutCancel && this._checkLosscutCancel(this))) {
                yield this.cancel();
                return;
            }
            if (this.state.enabledOpen && this._checkOpen(this)) {
                this._openOrder = this._getOpenOrder(this);
                yield this.open();
                return;
            }
            if (this.state.enabledClose && this._checkClose(this)) {
                this._closeOrder = this._getCloseOrder(this);
                yield this.close();
                return;
            }
            if (this.state.enabledLosscut && this._checkLosscut && this._getLosscutOrder && this._checkLosscut(this)) {
                this._losscutOrder = this._getLosscutOrder(this);
                yield this.losscut();
                return;
            }
        });
    }
    updateOpenOrder(order) {
        if (!this._openOrder) {
            return;
        }
        const size = this._openOrder.roundSize(order.size);
        const filled = this._openOrder.roundSize(order.filledSize);
        const price = this._openOrder.roundPrice(order.avgFillPrice ? order.avgFillPrice : order.price);
        if (filled !== size) {
            this.state.setOrderCanceled();
            if (this.onOpenOrderCanceled) {
                this.onOpenOrderCanceled(this);
            }
            return;
        }
        if (filled === size) {
            this.setOpen(filled, price);
            return;
        }
    }
    updateCloseOrder(order) {
        if (!this._closeOrder || !this._openOrder) {
            return;
        }
        const size = this._closeOrder.roundSize(order.size);
        const filled = this._closeOrder.roundSize(order.filledSize);
        if (filled > 0) {
            if (["close", "losscut"].includes(this.state.orderState)) {
                this._currentSize = this._closeOrder.roundSize(this._currentSize - filled);
                this._closePrice = this._closeOrder.roundPrice(order.avgFillPrice ? order.avgFillPrice : order.price);
            }
        }
        if (filled !== size) {
            this.state.setOrderCanceled();
            if (this.onCloseOrderCanceled) {
                this.onCloseOrderCanceled(this);
            }
            return;
        }
        if (filled === size) {
            this.setClose();
        }
    }
    updateLosscutOrder(order) {
        if (!this._losscutOrder || !this._openOrder) {
            return;
        }
        const size = this._losscutOrder.roundSize(order.size);
        const filled = this._losscutOrder.roundSize(order.filledSize);
        if (filled > 0) {
            this._currentSize = this._losscutOrder.roundSize(this._currentSize - filled);
            this._closePrice = this._losscutOrder.roundPrice(order.avgFillPrice ? order.avgFillPrice : order.price);
        }
        if (filled !== size) {
            this.state.setOrderCanceled();
            if (this.onLosscutOrderCanceled) {
                this.onLosscutOrderCanceled(this);
            }
            return;
        }
        if (filled === size) {
            if (this.state.isLosscut) {
                this._losscutCount++;
                if (this.onDoneLosscut) {
                    this.onDoneLosscut(this);
                }
            }
            this.setClose();
        }
    }
    setOpen(size, price) {
        if (!this._openOrder) {
            return;
        }
        this._openPrice = price;
        this._currentSize = size;
        this._initialSize = size;
        this.state.setOrderClosed();
        if (this.onOpened) {
            this.onOpened(this);
        }
    }
    setClose() {
        if (!this._openOrder || !this._closeOrder) {
            return;
        }
        const priceDiff = this._openOrder.side === 'buy' ? (this._closePrice - this._openPrice) : (this._openPrice - this._closePrice);
        this._cumulativeProfit += this._initialSize * priceDiff;
        this._initialSize = 0;
        this._currentSize = 0;
        this._closeCount++;
        this.state.setOrderClosed();
        if (this.onClosed) {
            this.onClosed(this);
        }
    }
    updateOrder(order) {
        if (order.status !== 'closed') {
            return;
        }
        if (order.orderID !== this.state.orderID) {
            return;
        }
        if (this.state.orderState === "open") {
            this.updateOpenOrder(order);
        }
        else if (this.state.orderState === "close") {
            this.updateCloseOrder(order);
        }
        else if (this.state.orderState === "losscut") {
            this.updateLosscutOrder(order);
        }
    }
    get profit() {
        return this._cumulativeProfit - this._cumulativeFee;
    }
    get unrealizedProfit() {
        let result = 0;
        if (this._openOrder && this._currentSize > 0) {
            if (this._openOrder.side === 'buy') {
                result = (this.bestBid - this._openPrice) * this._currentSize;
            }
            else {
                result = (this._openPrice - this.bestAsk) * this._currentSize;
            }
        }
        return result;
    }
    get closeCount() {
        return this._closeCount;
    }
    get losscutCount() {
        return this._losscutCount;
    }
    get ticker() {
        return this._ticker;
    }
    get bestBid() {
        return this._ticker.bid;
    }
    get bestAsk() {
        return this._ticker.ask;
    }
    get state() {
        return this._positionState;
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
    get losscutOrder() {
        return this._losscutOrder;
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
