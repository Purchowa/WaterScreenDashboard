import { Schema, model } from "mongoose";
import { WaterscreenStateModelType } from "modules/models/waterscreenState.model";

import { ModeVariant, FluidLevel } from "../models/waterscreenState.model";

const WaterscreenStateSchema = new Schema({
    mode: {
        type: Number,
        min: ModeVariant.Standard,
        max: ModeVariant.SIZE - 1,
        required: true
    },
    fluidLevel: {
        type: Number,
        min: FluidLevel.Optimal,
        max: FluidLevel.SIZE - 1,
        required: true
    },
    isPresenting: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: false
    }
});

export const StateModel = model<WaterscreenStateModelType>('WaterscreenState', WaterscreenStateSchema);