import { Schema, Types } from "mongoose";
import { RGBType, PictureDataType } from "modules/models/picture.model";


export default function createPictureSchema(maxSize: number) {
    if (maxSize < 0)
        throw new Error("Picture max size cannot be negative!");

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

    return new Schema<PictureDataType>({
        size: {
            type: Number,
            min: 0,
            max: maxSize,
            required: true
        },
        data: {
            type: Array<String>,
            validate: [
                {
                    validator: function (data: any) {
                        return !data.some(isNaN);
                    },
                    message: () => "Picture data must be composed of numbers!",
                },
                {
                    validator: function (this: any, data: String[]) {
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
}