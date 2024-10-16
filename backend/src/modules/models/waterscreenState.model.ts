
export enum ModeVariant {
    Standard,
    Demo,
    Service,
    SIZE
};

export enum FluidLevel {
    Optimal,
    Low,
    SIZE
}

export type WaterscreenStateModelType = {
    mode: ModeVariant,
    fluidLevel: FluidLevel
    isPresenting: boolean,
    data?: Date
};
