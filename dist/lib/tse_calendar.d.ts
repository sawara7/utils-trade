import 'moment/locale/ja';
export declare const TokyoStockMarketClosedDays: readonly ["20240429", "20240503", "20240506", "20240715", "20240812", "20240916", "20240923", "20241014", "20241104", "20241231", "20250101", "20250102", "20250103", "20250113", "20250211", "20250224", "20250320", "20250429", "20250503", "20250505", "20250506", "20250721", "20250811", "20250915", "20250923", "20251013", "20251103", "20251124", "20251231"];
export type TokyoStockMarketClosedDay = typeof TokyoStockMarketClosedDays[number];
export declare function IsTokyoStockMarketClosed(date?: Date, onlyDate?: boolean): boolean;
export interface getExpireDateOption {
    date?: Date;
    expire?: number;
}
export declare function getExpireDate(op?: getExpireDateOption): number;
