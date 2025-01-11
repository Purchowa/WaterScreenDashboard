import { Schema, model } from "mongoose";
import createPictureSchema from "./picture.schema";

const PictureCollectionSchema = new Schema({
    pictures: {
        type: [createPictureSchema(256)],
        required: true,
    },
});

export const PictureCollectionModel = model("PictureCollection", PictureCollectionSchema);
