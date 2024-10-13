import { Schema, model } from "mongoose";
import { ConfigModelType, PictureDataType } from "modules/models/config.model";

import { ModeVariant } from "../models/waterscreenState.model";

function isTimeRequired(this: ConfigModelType) {
    return this.mode === ModeVariant.Standard;
}

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
        required: isTimeRequired
    },
    idleTime: {
        type: Number,
        min: 1,
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
            size: {
                type: Number,
                min: 0,
                max: 64,
                required: true
            },
            data: {
                type: Array<Number>,
                validate: {
                    validator: function (this: any, data: number[]) {
                        return data.length === this.get('size');
                    },
                    message: () => "Picutre size doesn't match the data array length!",
                },
                required: true
            },
        },
        required: false
    }
})

export const ConfigModel = model("Config", ConfigSchema);