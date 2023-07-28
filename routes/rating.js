import { Agenda } from "@hokify/agenda";
import Submission from "../models/submission.js";
import User from "../models/user.js";
import Transaction from "../models/transaction.js";

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
    const transactions = [...userSet].map((u) => ({ delta: 0, contest: id, user: u }));
    const insertedTransactions = await Transaction.insertMany(transactions);
    await User.updateMany(
        { _id: { $in: userSet } },
        { $push: { transactions: { $each: insertedTransactions.map((t) => t._id) } } }
    );
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

await agenda.start();

export { agenda, updateUserRatings };
