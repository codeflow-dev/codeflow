import mongoose, { Schema, SchemaTypes } from "mongoose";
const transactionSchema = new Schema({
    delta: Number,
    user: {
        type: SchemaTypes.ObjectId,
        ref: "User",
    },
    contest: {
        type: SchemaTypes.ObjectId,
        ref: "Contest",
    },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
