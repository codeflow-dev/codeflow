import { Schema, SchemaTypes, model } from "mongoose";

const submissionSchema = new Schema({
    code: String,
    language: String,
    problem: {
        type: SchemaTypes.ObjectId,
        ref: "Problem",
    },
    contest: {
        type: SchemaTypes.ObjectId,
        ref: "Contest",
    },
    submittedat: {
        type: Date,
        default: () => Date.now(),
    },
    submittedby: {
        type: SchemaTypes.ObjectId,
        ref: "User",
    },
});

const Submission = model("Submission", submissionSchema);

export default Submission;
