"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOrderClass = void 0;
const utils_general_1 = require("utils-general");
class BaseOrderClass extends utils_general_1.BaseObjectClass {
    constructor(params) {
        super();
        this._clientID = params && params.clientID ? params.clientID : '';
        this._market = params ? params.market : {
            name: '',
            type: 'spot',
            crossOrder: false,
            sizeResolution: 0,
            priceResolution: 0,
            minOrderSize: 0
        };
        this._type = params ? params.type : 'limit';
        this._side = params ? params.side : 'buy';
        this._size = params ? params.size : 0;
        this._price = params ? params.price : 0;
        this._postOnly = params && params.postOnly ? true : false;
    }
    import(jsn) {
        super.import(jsn);
        const v = jsn;
        this._clientID = v._clientID;
        this._market = v._market;
        this._type = v._type;
        this._side = v._side;
        this._size = v._size;
        this._price = v._price;
        this._postOnly = v._postOnly;
    }
    export() {
        const v = super.export();
        v._clientID = this._clientID;
        v._market = this._market;
        v._type = this._type;
        v._side = this._side;
        v._size = this._size;
        v._price = this._price;
        v._postOnly = this._postOnly;
        return v;
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
