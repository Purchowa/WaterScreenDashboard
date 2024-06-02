import { ConfigModelType } from "../models/config.model";
import { ConfigModel } from "../schemas/config.schema";

export default class ConfigService {
    public getAllConfig = async (): Promise<ConfigModelType | undefined> => {
        const data = await ConfigModel.findOne({});
        return data ? { mode: data.mode, enableWeekends: data.enableWeekends, workTime: data.workTime, idleTime: data.idleTime, mailList: data.mailList } : undefined;
    }

    public getWaterscreenConfig = async (): Promise<ConfigModelType | undefined> => {
        const data = await ConfigModel.findOne({});
        return data ? { mode: data.mode, enableWeekends: data.enableWeekends, workTime: data.workTime, idleTime: data.idleTime } : undefined;
    }

    public updateConfig = async (config: ConfigModelType) => {
        return ConfigModel.replaceOne({}, config).setOptions({ upsert: true });
    }
}