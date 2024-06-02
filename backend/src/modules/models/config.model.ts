import { ModeVariant } from "./waterscreenState.model"

export type ConfigModelType = {
    mode: ModeVariant,
    enableWeekends: boolean,
    workTime?: number,
    idleTime?: number,
    mailList?: string[]
    picture?: { data: number[], size: number }
}