import { Schema, model } from "mongoose";
import { UserModelType } from "modules/models/user.model";

const UserSchema = new Schema<UserModelType>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

export const UserModel = model("User", UserSchema);