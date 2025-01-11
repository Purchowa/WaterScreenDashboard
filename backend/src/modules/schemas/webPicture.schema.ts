import { Schema, model } from "mongoose";
import createPictureSchema from "./picture.schema";
import { WebPictureDataType } from "modules/models/webPicture.model";

const WebPictureSchema = new Schema<WebPictureDataType>({
    wasRead: {
        type: Boolean,
        required: true
    },
    picture: {
        type: createPictureSchema(48),
        required: true,
    },
});

export const WebPictureModel = model("WebPicture", WebPictureSchema);
