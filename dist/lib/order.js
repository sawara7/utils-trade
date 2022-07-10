"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOrderClass = void 0;
const my_utils_1 = require("my-utils");
class BaseOrderClass extends my_utils_1.UUIDInstanceClass {
    constructor(params) {
        super();
        this._market = params.market;
        this._type = params.type;
        this._side = params.side;
        this._size = params.size;
        this._price = params.price;
        this._postOnly = params.postOnly ? true : false;
    }
    get market() {
        return this._market;
    }
    get type() {
        return this._type;
    }
    get side() {
        return this._side;
    }
    get price() {
        if (!this._price) {
            throw Error();
        }
        return this.roundPrice(this._price);
    }
    get size() {
        return this.roundSize(this._size);
    }
    get postOnly() {
        return this._postOnly;
    }
    roundSize(size) {
        return Math.floor(size * (1 / this.market.sizeResolution)) / (1 / this.market.sizeResolution);
    }
    roundPrice(price) {
        if (this._side === "buy") {
            return Math.floor(price * (1 / this.market.priceResolution)) / (1 / this.market.priceResolution);
        }
        else {
            return Math.round(price * (1 / this.market.priceResolution)) / (1 / this.market.priceResolution);
        }
    }
}
exports.BaseOrderClass = BaseOrderClass;
