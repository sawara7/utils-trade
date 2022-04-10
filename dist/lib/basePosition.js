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
        this._orderLock = false;
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
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doOrder('open');
        });
    }
    doOpen() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doOrder('close');
        });
    }
    doClose() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    get enabledOpen() {
        return !this._orderLock;
    }
    get enabledClose() {
        return !this._orderLock;
    }
    get profit() {
        return this._cumulativeProfit - this._cumulativeFee;
    }
    get closeCount() {
        return this._closeCount;
    }
}
exports.BasePositionClass = BasePositionClass;
