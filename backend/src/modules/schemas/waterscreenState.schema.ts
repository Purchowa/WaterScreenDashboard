import { Schema, model } from "mongoose";
import { WaterscreenStateModelType } from "modules/models/waterscreenState.model";

const WaterscreenStateSchema = new Schema({
    mode: { type: Number, required: true },
    fluidLevel: { type: Number, required: true },
    isPresenting: { type: Boolean, required: true },
    date: { type: Date, default: Date.now, required: false }
});

export const StateModel = model<WaterscreenStateModelType>('WaterscreenState', WaterscreenStateSchema);