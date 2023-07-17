import { Router } from "express";
import { verifyJWT } from "../midlewares/verify_jwt.js";
import { verifySetter } from "../midlewares/verify_setter.js";
import Contest from "../models/contest.js";
import Problem from "../models/problem.js";
import { assertString } from "../util.js";

const router = Router();

router.get("/contests/upcoming", async (req, res) => {
    try {
        const currentDate = new Date();
        const info = await Contest.find({ contestDate: { $gt: currentDate } }).select(
            "level round contestDate duration"
        );
        const upcoming = info.map(({ level, round, contestDate, duration }) => ({
            contestName: `Codeflow ${level} Contest ${round}`,
            contestDate,
            duration,
        }));
        res.status(200).json(upcoming);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/contests/past", async (req, res) => {
    try {
        const currentDate = new Date();
        const info = await Contest.find({
            $expr: {
                $lt: [
                    {
                        $add: ["$contestDate", "$duration"],
                    },
                    currentDate,
                ],
            },
        }).populate("problems");
        const past = info.map((contest) => ({
            contestName: `Codeflow ${contest.level} Contest ${contest.round}`,
            problems: contest.problems.map(({ _id, title }) => ({
                _id,
                title,
            })),
        }));
        res.status(200).json(past);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.post("/contests", [verifyJWT, verifySetter], async (req, res) => {
    try {
        const { level, problems, contestDate, duration } = req.body;
        assertString(level);
        const contest = new Contest({ level, contestDate, duration });
        const probs = await Problem.insertMany(problems);
        const probIds = probs.map((p) => p._id);
        contest.problems = probIds;
        contest.setter = req.payload.id;
        await contest.save();
        await contest.populate("problems");
        res.status(200).json(contest);
    } catch (err) {
        console.error(err);
        res.status(401).json({
            error: "Scheduling contest failed",
        });
    }
});

export default router;
