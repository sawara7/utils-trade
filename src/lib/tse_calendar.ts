import moment from 'moment-timezone'
import 'moment/locale/ja'

export const TokyoStockMarketClosedDays = [
    "20240429",
    "20240503",
    "20240506",
    "20240715",
    "20240812",
    "20240916",
    "20240923",
    "20241014",
    "20241104",
    "20241231",
    "20250101",
    "20250102",
    "20250103",
    "20250113",
    "20250211",
    "20250224",
    "20250320",
    "20250429",
    "20250503",
    "20250505",
    "20250506",
    "20250721",
    "20250811",
    "20250915",
    "20250923",
    "20251013",
    "20251103",
    "20251124",
    "20251231"
] as const

export type TokyoStockMarketClosedDay = typeof TokyoStockMarketClosedDays[number]

export function IsTokyoStockMarketClosed(date?: Date, onlyDate?: boolean): boolean {
    const d = date? date: new Date()
    const dd = moment.tz(d.getTime(), 'Asia/Tokyo')
    if ([0, 6].includes(dd.day())) return true
    for (const holiday of TokyoStockMarketClosedDays) {
        const h = moment.tz(holiday + 'T000000+0900', 'Asia/Tokyo')
        if (
            dd.year() === h.year() &&
            dd.month() === h.month() &&
            dd.date() === h.date()){
                return true
            }
    }
    const t = dd.hours()*60*60 + dd.minutes()*60 + dd.seconds() 
    if (9*60*60 - 10*60< t && t < 11*60*60+30*60) return false
    if (12*60*60+30*60 - 10*60 < t && t < 15*60*60) return false
    return !onlyDate
}

// get expire date for kabuS API
export interface getExpireDateOption {
    date?: Date,
    expire?: number
}

export function getExpireDate(op?: getExpireDateOption): number {
    const d = op && op.date? op.date: new Date()
    d.setDate(d.getDate() + (op && op.expire? op.expire: 7))
    while(IsTokyoStockMarketClosed(d, true)) {
        d.setDate(d.getDate() - 1)
    }
    var yyyy = d.getFullYear();
    var mm = ('00' + (d.getMonth()+1)).slice(-2);
    var dd = ('00' + (d.getDate())).slice(-2);
    const ymd = String(yyyy) + String(mm) + String(dd);
    return parseInt(ymd);
  }