import { WaterscreenStateModel } from "../models/waterscreenState.model";
import { StateModel } from "../schemas/waterscreenState.schema";

export default class WaterscreenStateService {
    public getLatestState = async (): Promise<WaterscreenStateModel | undefined> => {

        const data = await StateModel.findOne({}).sort('-date');

        if (data) {
            return { mode: data.mode, fluidLevel: data.fluidLevel, isPresenting: data.isPresenting };
        }
        else
            return undefined;
    }

    public addState = async (state: WaterscreenStateModel) => {
        return StateModel.create(state);
    }
}