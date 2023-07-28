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
    submittedAt: {
        type: Date,
        default: () => Date.now(),
    },
    submittedBy: {
        type: SchemaTypes.ObjectId,
        ref: "User",
    },
    message: String,
});

const Submission = model("Submission", submissionSchema);

export default Submission;
