import { Schema, SchemaTypes, model } from "mongoose";

const problemSchema = new Schema({
    id: String,
    title: String,
    statement: String,
    contest: {
        type: SchemaTypes.ObjectId,
        ref: "Contest",
    },
    testCases: [{ type: SchemaTypes.ObjectId, ref: "TestCase" }],
    samples: Number,
    checker: String,
    rating: {
        type: Number,
        default: 0,
    },
});

const Problem = model("Problem", problemSchema);

export default Problem;
