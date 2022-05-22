"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const positionState_1 = require("./positionState");
test('test positionState', () => {
    expect(positionState_1.PositionStateList.includes('opened')).toBe(true);
});
