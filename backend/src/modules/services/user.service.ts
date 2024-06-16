import bcrypt from "bcryptjs"

import { UserModel } from "../schemas/user.schema";
import { UserModelType } from "../models/user.model";

export default class UserService {
    public isValidUser = async (user: UserModelType): Promise<boolean> => {
        const hashedUser = await UserModel.findOne({ username: user.username });
        if (hashedUser) {
            const match = await bcrypt.compare(user.password, hashedUser.password);
            return match;
        }
        return false;
    }
}