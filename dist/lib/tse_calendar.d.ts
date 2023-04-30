import 'moment/locale/ja';
export declare const TokyoStockMarketClosedDays: readonly ["20230101", "20230102", "20230103", "20230109", "20230211", "20230223", "20230321", "20230429", "20230503", "20230504", "20230505", "20230717", "20230811", "20230918", "20230923", "20231009", "20231103", "20231123", "20231231"];
export type TokyoStockMarketClosedDay = typeof TokyoStockMarketClosedDays[number];
export declare function IsTokyoStockMarketClosed(date?: Date, onlyDate?: boolean): boolean;
export interface getExpireDateOption {
    date?: Date;
    expire?: number;
}
export declare function getExpireDate(op?: getExpireDateOption): number;
