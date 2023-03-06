"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTokyoStockMarketClosed = exports.TokyoStockMarketClosedDays = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
require("moment/locale/ja");
exports.TokyoStockMarketClosedDays = [
    "20230101",
    "20230102",
    "20230103",
    "20230109",
    "20230211",
    "20230223",
    "20230321",
    "20230429",
    "20230503",
    "20230504",
    "20230505",
    "20230717",
    "20230811",
    "20230918",
    "20230923",
    "20231009",
    "20231103",
    "20231123",
    "20231231" //（日）	休業日
];
function IsTokyoStockMarketClosed(date) {
    const d = date ? date : new Date();
    const dd = moment_timezone_1.default.tz(d.getTime(), 'Asia/Tokyo');
    if ([0, 6].includes(dd.day()))
        return true;
    for (const holiday of exports.TokyoStockMarketClosedDays) {
        const h = moment_timezone_1.default.tz(holiday + 'T000000+0900', 'Asia/Tokyo');
        if (dd.year() === h.year() &&
            dd.month() === h.month() &&
            dd.date() === h.date()) {
            return true;
        }
    }
    const t = dd.hours() * 60 * 60 + dd.minutes() * 60 + dd.seconds();
    if (9 * 60 * 60 - 10 * 60 < t && t < 11 * 60 * 60 + 30 * 60)
        return false;
    if (12 * 60 * 60 + 30 * 60 - 10 * 60 < t && t < 15 * 60 * 60)
        return false;
    return true;
}
exports.IsTokyoStockMarketClosed = IsTokyoStockMarketClosed;
