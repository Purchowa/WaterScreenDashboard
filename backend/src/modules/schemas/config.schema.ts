import { Schema, model } from "mongoose";
import { ConfigModelType } from "modules/models/config.model";

const ConfigSchema = new Schema({
    mode: { type: Number, required: true },
    enableWeekends: { type: Boolean, required: true },
    workTime: { type: Number, required: true },
    idleTime: { type: Number, required: false },
    mailList: { type: Array<String>, required: false },
    picture: { type: { data: { type: Array<Number>, required: true }, size: { type: Number, required: true } }, required: false }
})

export const ConfigModel = model<ConfigModelType>("Config", ConfigSchema);