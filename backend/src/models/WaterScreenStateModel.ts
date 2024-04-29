
enum ModeVariant {
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

export type WaterScreenStateModel = {
    mode: ModeVariant,
    fluidLevel: FluidLevel
    isPresenting: boolean,
};


export function getMockState(): WaterScreenStateModel {
    const mode: ModeVariant = Math.floor(Math.random() * ModeVariant.SIZE);
    const fluidLevel: FluidLevel = Math.floor(Math.random() * FluidLevel.SIZE);
    const isPresenting: boolean = Boolean(Math.floor(Math.random() + 0.5));

    return { mode: mode, fluidLevel: fluidLevel, isPresenting: isPresenting };
}
