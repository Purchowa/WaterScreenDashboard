import { ConfigModelType } from "../models/config.model";
import { ConfigModel } from "../schemas/config.schema";

export default class ConfigService {
    public getAllConfig = async (): Promise<ConfigModelType | undefined> => {
        const config = await ConfigModel.findOne({}).select('-_id -__v -wasRead -workRange._id');
        return config ? config : undefined;
    }

    public getWaterscreenConfig = async (): Promise<ConfigModelType | undefined> => {
        const config = await ConfigModel.findOne({}).select('-_id -__v -mailList -workRange._id');
        if (!config) {
            return undefined;
        }

        if (!config.wasRead) {
            await ConfigModel.updateOne({}, { ...config.toObject(), wasRead: true });
        }

        return config;
    }

    public updateConfig = async (config: ConfigModelType) => {
        config.wasRead = false;

        return ConfigModel.replaceOne({}, config).setOptions({ upsert: true, runValidators: true });
    }
}