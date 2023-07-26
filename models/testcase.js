import mongoose, { Schema } from "mongoose";
const testCaseSchema = new Schema({
    input: String,
    output: String,
});

const TestCase = mongoose.model("TestCase", testCaseSchema);

export default TestCase;
