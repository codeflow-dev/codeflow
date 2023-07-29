import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    setter: { type: Boolean, default: false },
    rating: { type: Number, default:0},
});

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(this.password, salt);
        this.password = hashed;
        next();
    } catch (error) {
        next(error);
    }
});

const User = model("User", userSchema);

export default User;
