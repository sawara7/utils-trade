import moment from 'moment-timezone'
import 'moment/locale/ja'

export const TokyoStockMarketClosedDays = [
    "20230101",//（日）	元日
    "20230102",//（月）	振替休日
    "20230103",//（火）	休業日
    "20230109",//（月）	成人の日
    "20230211",//（土）	建国記念の日
    "20230223",//（木）	天皇誕生日
    "20230321",//（火）	春分の日
    "20230429",//（土）	昭和の日
    "20230503",//（水）	憲法記念日
    "20230504",//（木）	みどりの日
    "20230505",//（金）	こどもの日
    "20230717",//（月）	海の日
    "20230811",//（金）	山の日
    "20230918",//（月）	敬老の日
    "20230923",//（土）	秋分の日
    "20231009",//（月）	スポーツの日
    "20231103",//（金）	文化の日
    "20231123",//（木）	勤労感謝の日
    "20231231"//（日）	休業日
] as const

export type TokyoStockMarketClosedDay = typeof TokyoStockMarketClosedDays[number]

export function IsTokyoStockMarketClosed(date?: Date): boolean {
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
    return true
}