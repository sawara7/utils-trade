"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGODB_TABLE_POSITIONS = exports.MONGODB_TABLE_CUMULATIVEPL = exports.MONGODB_TABLE_TICKERSTATISTICS = exports.MONGODB_TABLE_TICKER = exports.MONGODB_TABLE_BOTSTATUS = exports.MONGODB_DB_BOTSTATUS = void 0;
exports.getBaseBotStatus = getBaseBotStatus;
exports.getTickerPath = getTickerPath;
exports.getInitializedTickerStatistics = getInitializedTickerStatistics;
exports.MONGODB_DB_BOTSTATUS = 'botStatus';
exports.MONGODB_TABLE_BOTSTATUS = 'status';
exports.MONGODB_TABLE_TICKER = 'ticker';
exports.MONGODB_TABLE_TICKERSTATISTICS = 'statistics';
exports.MONGODB_TABLE_CUMULATIVEPL = 'cumulativePL';
exports.MONGODB_TABLE_POSITIONS = 'positions';
function getBaseBotStatus() {
    return {
        botName: '',
        isClear: false,
        isStop: false,
        isExit: false,
        message: '-',
        startDate: Date.now(),
        lastDate: Date.now()
    };
}
function getTickerPath(key) {
    return exports.MONGODB_TABLE_TICKER + '-' + key;
}
function getInitializedTickerStatistics() {
    return {
        ask: 0,
        bid: 0,
        currency: 'USD',
        exchange: '',
        pair: '',
        timeStamp: 0,
        average: [],
        correlation: [],
        slope: [],
        stdv: [],
        sampleSize: []
    };
}
