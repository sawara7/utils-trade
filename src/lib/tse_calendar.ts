import moment from 'moment-timezone'
import 'moment/locale/ja'

export const TokyoStockMarketClosedDays = [
    "2023/01/01",//（日）	元日
    "2023/01/02",//（月）	振替休日
    "2023/01/03",//（火）	休業日
    "2023/01/09",//（月）	成人の日
    "2023/02/11",//（土）	建国記念の日
    "2023/02/23",//（木）	天皇誕生日
    "2023/03/21",//（火）	春分の日
    "2023/04/29",//（土）	昭和の日
    "2023/05/03",//（水）	憲法記念日
    "2023/05/04",//（木）	みどりの日
    "2023/05/05",//（金）	こどもの日
    "2023/07/17",//（月）	海の日
    "2023/08/11",//（金）	山の日
    "2023/09/18",//（月）	敬老の日
    "2023/09/23",//（土）	秋分の日
    "2023/10/09",//（月）	スポーツの日
    "2023/11/03",//（金）	文化の日
    "2023/11/23",//（木）	勤労感謝の日
    "2023/12/31"//（日）	休業日
] as const

export type TokyoStockMarketClosedDay = typeof TokyoStockMarketClosedDays[number]

export function IsTokyoStockMarketClosed(date?: Date): boolean {
    const d = date? date: new Date()
    const dd = moment.tz(d.getTime(), 'Asia/Tokyo')
    if (dd.day() in [0, 6]) return true
    for (const holiday of TokyoStockMarketClosedDays) {
        const h = moment.tz(holiday, 'Asia/Tokyo')
        if (
            dd.year() === h.year() &&
            dd.month() === h.month() &&
            dd.date() === h.date()){
                return true
            }
    }
    const t = dd.hours()*60*60 + dd.minutes()*60 + dd.seconds() 
    if (9*60*60 < t && t < 11*60*60+30*60) return false
    if (12*60*60+30*60 < t && t < 15*60*60) return false
    return true
}