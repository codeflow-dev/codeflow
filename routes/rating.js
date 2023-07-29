import { Agenda } from "@hokify/agenda";
import Submission from "../models/submission.js";
import Contest from "../models/contest.js";
import User from "../models/user.js";
import Problem from "../models/problem.js";
import Transaction from "../models/transaction.js";
import dotenv from "dotenv";

dotenv.config();

const agenda = new Agenda({
    db: { address: process.env.MONGODB_URI || "mongodb://localhost/codeflow", collection: "jobs" },
});

agenda.define("rating", async (job) => {
    const { id } = job.attrs.data;
    updateUserRatings(id);
});

async function updateUserRatings(id) {
    const submissions = await Submission.find({ contest: id }).select("submittedBy message");
    const users = submissions.map((s) => s.submittedBy.toString());
    const userSet = new Set(users);
    const userArray = [...userSet];
    const transactions = userArray.map((u) => ({ delta: 0, contest: id, user: u }));
    const insertedTransactions = await Transaction.insertMany(transactions);
    for (let i = 0; i < userArray.length; i++) {
        await User.updateOne({ _id: userArray[i] }, { $push: { transactions: insertedTransactions[i]._id } });
    }
    for (const submission of submissions) {
        const transaction = await Transaction.findOne({ contest: id, user: submission.submittedBy });
        if (submission.message == "Accepted") {
            transaction.delta += 50;
        } else {
            transaction.delta -= 5;
        }
        await transaction.save();
    }
}

async function updateProblemRatings(id) {
    const { problems } = await Contest.findById(id);
    for (const problem of problems) {
        const users = await Submission.find({ problem, message: "Accepted" }).populate("submittedBy");
        const userPromises = users.map((u) => User.findById(u.submittedBy._id));
        let userRatings = await Promise.all(userPromises);
        userRatings = userRatings.map((u) => u.rating());
        userRatings = await Promise.all(userRatings);
        const mode = calculateModeByRange(userRatings, Math.sqrt(userRatings.length));
        const p = await Problem.findById(problem);
        p.rating = mode;
        await p.save();
    }
}

function calculateModeByRange(arr, rangeSize) {
    if (!Array.isArray(arr) || arr.length === 0 || !Number.isInteger(rangeSize) || rangeSize <= 0) {
        return null;
    }
    const numGroups = Math.ceil((Math.max(...arr) - Math.min(...arr) + 1) / rangeSize);
    const frequency = {};
    arr.forEach((element) => {
        const group = Math.floor((element - Math.min(...arr)) / rangeSize);
        frequency[group] = (frequency[group] || 0) + 1;
    });

    let modeGroup;
    let maxFrequency = 0;

    for (const key in frequency) {
        if (frequency[key] > maxFrequency) {
            modeGroup = key;
            maxFrequency = frequency[key];
        }
    }
    const mode = modeGroup * rangeSize + Math.min(...arr);
    return mode;
}

await agenda.start();

export { agenda, updateUserRatings, updateProblemRatings };
