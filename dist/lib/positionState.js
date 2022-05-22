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
        this._canceling = false;
    }
    setLosscut() {
        this._isLosscut = true;
    }
    setBeforePlaceOrder(od) {
        if (this.enabledOpen && od === "open") {
            this._orderState = "open";
        }
        else if (this.enabledClose && od === "close") {
            this._orderState = "close";
        }
        else if (this.enabledClose && od === "losscut" && this.isLosscut) {
            this._orderState = "losscut";
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
        if (this._canceling) {
            this._canceling = false;
        }
        else if (this._orderState === "open") {
            this._positionState = "opened";
        }
        else if (this._orderState === "close") {
            this._positionState = "closed";
        }
        else if (this._orderState === "losscut") {
            this._positionState = "closed";
            this._isLosscut = false;
        }
        this._orderState = "none";
        this._orderID = undefined;
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
    get orderCanceling() {
        return this._canceling;
    }
    get orderID() {
        return this._orderID;
    }
    get isNoOrder() {
        return !this.orderID && this.orderState === "none" && !this.orderCanceling;
    }
    get enabledOpen() {
        const c = ["neutral", "closed"];
        return c.includes(this.positionState) && this.isNoOrder;
    }
    get enabledClose() {
        const c = ["opened"];
        return c.includes(this.positionState) && this.isNoOrder;
    }
    get enabledLosscut() {
        const c = ["opened"];
        return c.includes(this.positionState) && !this.isLosscut && this.isNoOrder;
    }
    get enabledCancel() {
        return this.orderState !== "none" &&
            !!this.orderID &&
            !this.orderCanceling;
    }
    reset() {
        this._positionState = "neutral";
        this._isLosscut = false;
        this._orderState = "none";
        this._canceling = false;
        this._orderID = undefined;
    }
}
exports.PositionStateClass = PositionStateClass;
