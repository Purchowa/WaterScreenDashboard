import { Schema, model } from "mongoose";
import { ConfigModelType, Range } from "modules/models/config.model";

import { ModeVariant } from "../models/waterscreenState.model";

const ConfigSchema = new Schema<ConfigModelType>({
    wasRead: {
        type: Boolean,
        required: true
    },
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
        min: 1,
        required: true
    },
    idleTime: {
        type: Number,
        min: 1,
        required: true
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
    workRange: {
        type: {
            from: {
                type: Number,
                min: 0,
                max: 24,
                required: true
            },
            to: {
                type: Number,
                min: 0,
                max: 24,
                required: true
            }
        },
        validate: {
            validator: function (workRange: Range) {
                return workRange.from < workRange.to;
            },
            message: () => "'from' must be smaller than 'to'"
        },
        required: true
    }
})

export const ConfigModel = model("Config", ConfigSchema);
