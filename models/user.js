import bcrypt from "bcrypt";
import { Schema, SchemaTypes, model } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    setter: { type: Boolean, default: false },
    transactions: [
        {
            type: SchemaTypes.ObjectId,
            ref: "Transaction",
        },
    ],
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
