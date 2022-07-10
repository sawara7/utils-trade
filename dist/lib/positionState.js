"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionStateClass = exports.PositionOrderList = exports.PositionStateList = void 0;
exports.PositionStateList = [
    "neutral",
    "opened",
    "closed"
];
exports.PositionOrderList = [
    "none",
    "open",
    "close",
    "losscut"
];
class PositionStateClass {
    constructor() {
        this._isLosscut = false;
        this._positionState = "neutral";
        this._orderState = "none";
        this._orderStateTime = {};
        this._canceling = false;
    }
    setLosscut() {
        this._isLosscut = true;
    }
    setBeforePlaceOrder(od) {
        if (this.enabledOpen && od === "open") {
            this.orderState = "open";
        }
        else if (this.enabledClose && od === "close") {
            this.orderState = "close";
        }
        else if (this.enabledClose && od === "losscut" && this.isLosscut) {
            this.orderState = "losscut";
        }
        else {
            throw new Error("place order error.");
        }
    }
    setAfterPlaceOrder(id) {
        if (this._orderID) {
            throw new Error("set after place order error.");
        }
        this._orderID = id;
    }
    setCancelOrder() {
        if (this.isNoOrder) {
            throw new Error("cancel order error.");
        }
        this._canceling = true;
    }
    setOrderClosed() {
        if (this.isNoOrder) {
            throw new Error("order closed error.");
        }
        if (this._orderState === "open") {
            this._positionState = "opened";
        }
        else if (this._orderState === "close") {
            this._positionState = "closed";
        }
        else if (this._orderState === "losscut") {
            this._positionState = "closed";
            this._isLosscut = false;
        }
        this.orderState = "none";
        this._orderID = undefined;
    }
    setOrderCanceled() {
        if (this.isNoOrder || !this._canceling) {
            // console.log("order canceled error")
            // throw new Error("order canceled error.")
        }
        this._canceling = false;
        this.orderState = "none";
        this._orderID = undefined;
    }
    setOrderFailed() {
        this.orderState = "none";
        this._orderID = undefined;
    }
    setOrderCancelFailed() {
        this._canceling = false;
    }
    get isLosscut() {
        return this._isLosscut;
    }
    get positionState() {
        return this._positionState;
    }
    get orderState() {
        return this._orderState;
    }
    set orderState(s) {
        if (this._orderState !== s) {
            this._orderState = s;
            this._orderStateTime[s] = Date.now();
        }
    }
    getOrderStateTime(s) {
        return this._orderStateTime[s];
    }
    get orderCanceling() {
        return this._canceling;
    }
    get orderID() {
        return this._orderID;
    }
    get isNoOrder() {
        return !this.orderID && this.orderState === "none";
    }
    get enabledOpen() {
        const c = ["neutral", "closed"];
        return c.includes(this.positionState) && this.isNoOrder && !this._canceling;
    }
    get enabledClose() {
        const c = ["opened"];
        return c.includes(this.positionState) && this.isNoOrder && !this._canceling;
    }
    get enabledLosscut() {
        const c = ["opened"];
        return c.includes(this.positionState) && !this.isLosscut && !this._canceling;
    }
    get enabledOpenOrderCancel() {
        const c = ["neutral", "closed"];
        return c.includes(this.positionState) &&
            this.orderState !== "none" &&
            !!this.orderID &&
            !this.orderCanceling;
    }
    get enabledCloseOrderCancel() {
        const c = ["opened"];
        return c.includes(this.positionState) &&
            this.orderState !== "none" &&
            !!this.orderID &&
            !this.orderCanceling;
    }
    reset() {
        this._positionState = "neutral";
        this._isLosscut = false;
        this._orderState = "none";
        this._orderStateTime = {};
        this._canceling = false;
        this._orderID = undefined;
    }
}
exports.PositionStateClass = PositionStateClass;
