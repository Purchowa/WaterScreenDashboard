import { Schema, model } from "mongoose";
import { ConfigModelType, RGBType, PictureDataType, Range } from "modules/models/config.model";

import { ModeVariant } from "../models/waterscreenState.model";

const RGBSchema = new Schema<RGBType>({
    r: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    g: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    b: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
})

const PictureSchema = new Schema<PictureDataType>({
    size: {
        type: Number,
        min: 0,
        max: 64,
        required: true
    },
    data: {
        type: Array<Number>,
        validate: [
            {
                validator: function (data: any) {
                    return !data.some(isNaN);
                },
                message: () => "Picutre data must be composed of numbers!",
            },
            {
                validator: function (this: any, data: number[]) {
                    return data.length === this.get('size');
                },
                message: () => "Picutre size doesn't match the data array length!",
            }
        ],
        required: true
    },
    colors:
    {
        type:
        {
            main:
            {
                type: RGBSchema,
                required: true
            },
            secondary:
            {
                type: RGBSchema,
                required: true
            }
        },
        required: true
    }
})

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
    picture: {
        type: PictureSchema,
        required: true
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