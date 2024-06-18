import { ModeVariant } from "./waterscreenState.model"

export type PictureDataType = {
    picture: { data: number[], size: number }
}

export type ConfigModelType = {
    mode: ModeVariant,
    enableWeekends: boolean,
    workTime?: number,
    idleTime?: number,
    mailList?: string[]
    picture?: PictureDataType
}