export interface BotStatusForAPP {
    name: string
    cpl: number
    upl: number
    since: string
    latest: string
    running: boolean
  }
  
export const getDefaultBotStatus = (): BotStatusForAPP => {
    return {
        name: '',
        cpl: 0,
        upl: 0,
        since: '',
        latest: '',
        running: false
    }
}