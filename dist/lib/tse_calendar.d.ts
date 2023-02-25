import 'moment/locale/ja';
export declare const TokyoStockMarketClosedDays: readonly ["2023/01/01", "2023/01/02", "2023/01/03", "2023/01/09", "2023/02/11", "2023/02/23", "2023/03/21", "2023/04/29", "2023/05/03", "2023/05/04", "2023/05/05", "2023/07/17", "2023/08/11", "2023/09/18", "2023/09/23", "2023/10/09", "2023/11/03", "2023/11/23", "2023/12/31"];
export type TokyoStockMarketClosedDay = typeof TokyoStockMarketClosedDays[number];
export declare function IsTokyoStockMarketClosed(date?: Date): boolean;
