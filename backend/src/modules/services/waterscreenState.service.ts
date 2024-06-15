import { WaterscreenStateModelType } from "../models/waterscreenState.model";
import { StateModel } from "../schemas/waterscreenState.schema";

export default class WaterscreenStateService {
    public getLatestState = async (): Promise<WaterscreenStateModelType | undefined> => {

        const data = await StateModel.findOne({}).sort('-date');

        if (data) {
            return { mode: data.mode, fluidLevel: data.fluidLevel, isPresenting: data.isPresenting };
        }
        else
            return undefined;
    }

    public addState = async (state: WaterscreenStateModelType) => {
        return StateModel.create([state], { validateBeforeSave: true });
    }
}