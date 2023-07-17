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

contestSchema.pre("save", async function (next) {
    try {
        const count = await Contest.countDocuments();
        this.round = count + 1;
        next();
    } catch (err) {
        next(err);
    }
});

const Contest = model("Contest", contestSchema);

export default Contest;
