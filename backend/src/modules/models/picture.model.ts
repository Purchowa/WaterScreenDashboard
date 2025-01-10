import { Schema, model } from "mongoose";
import { PictureDataType, RGBType } from "modules/models/config.model";

const RGBSchema = new Schema<RGBType>({
    r: { type: Number, min: 0, max: 255, required: true },
    g: { type: Number, min: 0, max: 255, required: true },
    b: { type: Number, min: 0, max: 255, required: true },
});

const PictureSchema = new Schema<PictureDataType>({
    size: { type: Number, min: 0, max: 256, required: true },
    data: {
        type: [Number],
        validate: [
            {
                validator: function (data: any) {
                    return !data.some(isNaN);
                },
                message: () => "Picture data must be composed of numbers!",
            },
            {
                validator: function (this: any, data: number[]) {
                    return data.length === this.get('size');
                },
                message: () => "Picture size doesn't match the data array length!",
            },
        ],
        required: true,
    },
    colors: {
        type: {
            main: { type: RGBSchema, required: true },
            secondary: { type: RGBSchema, required: true },
        },
        required: true,
    },
});

const PictureCollectionSchema = new Schema({
    pictures: {
        type: [PictureSchema],
        required: true,
    },
});

export const PictureCollectionModel = model("PictureCollection", PictureCollectionSchema);
