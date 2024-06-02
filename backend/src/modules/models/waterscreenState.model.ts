
export enum ModeVariant {
    Standard,
    Demo,
    Service,
    SIZE
};

enum FluidLevel {
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


export function getMockState(): WaterscreenStateModelType {
    const mode: ModeVariant = Math.floor(Math.random() * ModeVariant.SIZE);
    const fluidLevel: FluidLevel = Math.floor(Math.random() * FluidLevel.SIZE);
    const isPresenting: boolean = Boolean(Math.floor(Math.random() + 0.5));

    return { mode: mode, fluidLevel: fluidLevel, isPresenting: isPresenting };
}
