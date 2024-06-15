import { Schema, model } from "mongoose";
import { ConfigModelType } from "modules/models/config.model";

import { ModeVariant } from "../models/waterscreenState.model";

function isTimeRequired(this: ConfigModelType) {
    return this.mode == ModeVariant.Standard;
}

const ConfigSchema = new Schema<ConfigModelType>({
    mode: {
        type: Number,
        min: 0,
        max: ModeVariant.SIZE - 1,
        required: true
    },
    enableWeekends: {
        type: Boolean,
        required: true
    },
    workTime: {
        type: Number,
        min: 0,
        required: isTimeRequired
    },
    idleTime: {
        type: Number,
        min: 0,
        required: isTimeRequired
    },
    mailList: {
        type: Array<String>,
        validate: {
            validator: function (mails: string[]) {
                const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return mails.every((mail) => regex.test(mail.toLowerCase()));
            },
            message: props => `${props.value} is not a valid e-mail address!`
        },
        required: false
    },
    picture: {
        type: {
            data: {
                type: Array<Number>,
                required: true
            },
            size: {
                type: Number,
                min: 0,
                max: 64,
                required: true
            }
        },
        required: false
    }
})

export const ConfigModel = model("Config", ConfigSchema);