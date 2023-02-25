"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTokyoStockMarketClosed = exports.TokyoStockMarketClosedDays = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
require("moment/locale/ja");
exports.TokyoStockMarketClosedDays = [
    "2023/01/01",
    "2023/01/02",
    "2023/01/03",
    "2023/01/09",
    "2023/02/11",
    "2023/02/23",
    "2023/03/21",
    "2023/04/29",
    "2023/05/03",
    "2023/05/04",
    "2023/05/05",
    "2023/07/17",
    "2023/08/11",
    "2023/09/18",
    "2023/09/23",
    "2023/10/09",
    "2023/11/03",
    "2023/11/23",
    "2023/12/31" //（日）	休業日
];
function IsTokyoStockMarketClosed(date) {
    const d = date ? date : new Date();
    const dd = moment_timezone_1.default.tz(d.getTime(), 'Asia/Tokyo');
    if (dd.day() in [0, 6])
        return true;
    for (const holiday of exports.TokyoStockMarketClosedDays) {
        const h = moment_timezone_1.default.tz(holiday, 'Asia/Tokyo');
        if (dd.year() === h.year() &&
            dd.month() === h.month() &&
            dd.date() === h.date()) {
            return true;
        }
    }
    const t = dd.hours() * 60 * 60 + dd.minutes() * 60 + dd.seconds();
    if (9 * 60 * 60 < t && t < 11 * 60 * 60 + 30 * 60)
        return false;
    if (12 * 60 * 60 + 30 * 60 < t && t < 15 * 60 * 60)
        return false;
    return true;
}
exports.IsTokyoStockMarketClosed = IsTokyoStockMarketClosed;
