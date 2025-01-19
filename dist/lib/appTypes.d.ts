export interface BotStatusForAPP {
    name: string;
    cpl: number;
    upl: number;
    since: string;
    latest: string;
    running: boolean;
}
export declare const getDefaultBotStatus: () => BotStatusForAPP;
