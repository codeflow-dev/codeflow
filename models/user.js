import bcrypt from "bcrypt";
import { Schema, SchemaTypes, model } from "mongoose";
import Transaction from "./transaction.js";

const userSchema = new Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    setter: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    transactions: [
        {
            type: SchemaTypes.ObjectId,
            ref: "Transaction",
            default: [],
        },
    ],
});

userSchema.methods.rating = async function () {
    const { transactions } = this;
    const t = await Transaction.find({ _id: { $in: transactions } });
    return t.reduce((a, b) => a + b.delta, 0);
};

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
