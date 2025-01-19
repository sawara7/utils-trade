export interface BotStatus {
    name: string;
    cpl: number;
    upl: number;
    since: string;
    latest: string;
    running: boolean;
}
export declare const getDefaultBotStatus: () => BotStatus;
