import { PictureDataType } from "modules/models/picture.model";
import { WebPictureDataType } from "modules/models/webPicture.model";
import { WebPictureModel } from "../schemas/webPicture.schema";

export default class WebPictureService {
    public getWebPicture = async () => {
        const picture = await WebPictureModel.findOne({}).select('-_id -__v -wasRead -picture._id -picture.colors._id -picture.colors.main._id -picture.colors.secondary._id');
        return picture?.picture;
    }

    public wasWebPictureRead = async () => {
        const picture = await WebPictureModel.findOne({}).select('-_id -__v -picture');
        if (!picture) {
            return undefined;
        }

        if (!picture.wasRead) {
            await WebPictureModel.updateOne({}, { ...picture.toObject(), wasRead: true });
        }

        return { wasRead: picture.wasRead };
    }

    public updateWebPicture = async (pictureData: PictureDataType) => {
        const webPicture: WebPictureDataType = { wasRead: false, picture: pictureData };

        return WebPictureModel.replaceOne({}, webPicture).setOptions({ upsert: true, runValidators: true });
    }

}