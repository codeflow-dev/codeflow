import { Schema, SchemaTypes, model } from "mongoose";

const contestSchema = new Schema({
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
    },
    round: Number,
    // setter: User,
    problems: [
        {
            type: SchemaTypes.ObjectId,
            ref: "Problem",
        },
    ],
});

const Contest = model("Contest", contestSchema);
