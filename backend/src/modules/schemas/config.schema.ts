import { Schema, model } from "mongoose";
import { ConfigModelType } from "modules/models/config.model";

const ConfigSchema = new Schema({
    mode: { type: Number, required: true },
    enableWeekends: { type: Boolean, required: true },
    workTime: { type: Number, required: false },
    idleTime: { type: Number, required: false },
    mailList: { type: Array<String>, required: false },
})

export const ConfigModel = model<ConfigModelType>("Config", ConfigSchema);