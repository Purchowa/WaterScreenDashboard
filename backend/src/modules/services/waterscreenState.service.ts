import { WaterscreenStateModelType } from "../models/waterscreenState.model";
import { StateModel } from "../schemas/waterscreenState.schema";

enum StateOrder {
    Latest = 0,
    BeforeLatest = 1
};

export default class WaterscreenStateService {
    public getLatestState = (): Promise<WaterscreenStateModelType | undefined> => {
        return this.getState(StateOrder.Latest);
    }

    public getOneBeforeLatestState = (): Promise<WaterscreenStateModelType | undefined> => {
        return this.getState(StateOrder.BeforeLatest);
    }

    public addState = async (state: WaterscreenStateModelType) => {
        return StateModel.create([state], { validateBeforeSave: true });
    }

    public async getManyStates(n: number) {
        return await StateModel.find({}).sort('-date').limit(n).select('-_id -__v');
    }

    private async getState(order: StateOrder) {
        const data = (await StateModel.find({}).sort('-date').limit(2)).at(order);

        if (data) {
            return { mode: data.mode, fluidLevel: data.fluidLevel, isPresenting: data.isPresenting };
        }
        else
            return undefined;
    }
}