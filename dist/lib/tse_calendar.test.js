"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tse_calendar_1 = require("./tse_calendar");
test('TSE Calendar', () => {
    console.log(new Date());
    expect((0, tse_calendar_1.IsTokyoStockMarketClosed)(new Date())).toBeTruthy();
    let date = new Date("2023-01-01T00:00:00");
    expect((0, tse_calendar_1.IsTokyoStockMarketClosed)(date)).toBeTruthy();
    date = new Date("2023-02-24T09:30:00");
    expect(!(0, tse_calendar_1.IsTokyoStockMarketClosed)(date)).toBeTruthy();
    date = new Date("2023-02-24T14:30:00");
    expect(!(0, tse_calendar_1.IsTokyoStockMarketClosed)(date)).toBeTruthy();
    date = new Date("2023-02-24T12:00:00");
    expect((0, tse_calendar_1.IsTokyoStockMarketClosed)(date)).toBeTruthy();
});
