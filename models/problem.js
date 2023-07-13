import { Schema, model } from "mongoose";

const problemSchema = new Schema({
    title: String,
    statement: String,
    testCases: [
        {
            input: String,
            output: String,
        },
    ],
    checker: String,
});

const Problem = model("Problem", problemSchema);

export default Problem;
