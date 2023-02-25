import { IsTokyoStockMarketClosed } from "./tse_calendar"

test('TSE Calendar', () => {
    expect(IsTokyoStockMarketClosed(new Date())).toBeTruthy()
    let date = new Date("2023-01-01T00:00:00")
    expect(IsTokyoStockMarketClosed(date)).toBeTruthy()
    date = new Date("2023-02-24T09:30:00")
    expect(!IsTokyoStockMarketClosed(date)).toBeTruthy()
    date = new Date("2023-02-24T14:30:00")
    expect(!IsTokyoStockMarketClosed(date)).toBeTruthy()
    date = new Date("2023-02-24T12:00:00")
    expect(IsTokyoStockMarketClosed(date)).toBeTruthy()
})