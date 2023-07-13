import { Schema, SchemaTypes, model } from "mongoose";

const submissionSchema = new Schema({
    code: String,
    language: String,
    problem: {
        type: SchemaTypes.ObjectId,
        ref: "Problem",
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
