import { ModeVariant } from "./waterscreenState.model"

export type Range = {
    from: number, to: number
}

export type ConfigModelType = {
    wasRead: boolean,
    mode: ModeVariant,
    enableWeekends: boolean,
    workTime: number,
    idleTime: number,
    mailList?: string[],
    workRange: Range,
    lastUpdate?: Date
}