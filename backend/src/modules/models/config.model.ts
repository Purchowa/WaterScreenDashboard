import { ModeVariant } from "./waterscreenState.model"

export type RGBType = {
    r: number,
    g: number,
    b: number
}

export type PictureDataType = {
    size: number,
    data?: number[],
    colors: {
        main: RGBType,
        secondary: RGBType
    }
}

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
    picture: PictureDataType,
    workRange: Range,
}