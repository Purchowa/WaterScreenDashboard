import { ConfigModelType } from "../models/config.model";
import { ConfigModel } from "../schemas/config.schema";

export default class ConfigService {
    public getAllConfig = async (): Promise<ConfigModelType | undefined> => {
        const data = await ConfigModel.findOne({}).select('-_id -__v -picture');
        return data ? data : undefined;
    }

    public getWaterscreenConfig = async (): Promise<ConfigModelType | undefined> => {
        const data = await ConfigModel.findOne({}).select('-_id -__v -mailList -picture._id');
        return data ? data : undefined;
    }

    public updateConfig = async (config: ConfigModelType) => {
        return ConfigModel.replaceOne({}, config).setOptions({ upsert: true, runValidators: true });
    }
}