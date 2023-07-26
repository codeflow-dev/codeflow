import { Schema, SchemaTypes, model } from "mongoose";

const contestSchema = new Schema({
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
    },
    round: Number,
    setter: {
        type: SchemaTypes.ObjectId,
        ref: "User",
    },
    problems: [
        {
            type: SchemaTypes.ObjectId,
            ref: "Problem",
        },
    ],
    contestDate: Date,
    duration: Number,
});

const Contest = model("Contest", contestSchema);

export default Contest;
