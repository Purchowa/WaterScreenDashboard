export type RGBType = {
    r: number,
    g: number,
    b: number
}

export type PictureDataType = {
    size: number,
    data?: string[] | BigInt[],
    colors: {
        main: RGBType,
        secondary: RGBType
    }
}
