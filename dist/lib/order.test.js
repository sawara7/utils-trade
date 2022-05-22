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
const __1 = require("..");
const marketInfo = {
    name: 'BCH-PERP',
    type: 'future',
    crossOrder: true,
    sizeResolution: 0.001,
    priceResolution: 0.05,
    minOrderSize: 1
};
const openOrder = new __1.BaseOrderClass({
    market: marketInfo,
    type: 'limit',
    side: 'buy',
    size: 1,
    price: 100
});
test('Order', () => __awaiter(void 0, void 0, void 0, function* () {
    expect(openOrder.size).toBe(1);
}));
