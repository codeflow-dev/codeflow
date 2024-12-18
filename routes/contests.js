import { Router } from "express";
import { verifyJWT } from "../midlewares/verify_jwt.js";
import { verifySetter } from "../midlewares/verify_setter.js";
import Contest from "../models/contest.js";
import Problem from "../models/problem.js";
import { assertString } from "../util.js";
import TestCase from "../models/testcase.js";

const router = Router();

router.get("/contests/current", async (req, res) => {
    try {
        const currentDate = new Date();
        const contest = await Contest.findOne({
            $expr: {
                $and: [
                    { $gte: [currentDate, "$contestDate"] },
                    { $lte: [currentDate, { $add: ["$contestDate", "$duration"] }] },
                ],
            },
        }).populate("problems");
        if (!contest) {
            res.status(200).json([]);
        } else {
            const current = {
                contestName: `Codeflow ${contest.level} Contest ${contest.round}`,
                problems: contest.problems.map(({ _id, id, title }) => ({
                    _id,
                    id,
                    title,
                })),
                contestDate: contest.contestDate,
                duration: contest.duration,
                round: contest.round,
            };
            res.status(200).json([current]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

router.get("/contests/upcoming", async (req, res) => {
    try {
        const currentDate = new Date();
        const info = await Contest.find({ contestDate: { $gt: currentDate } }).select(
            "level round contestDate duration"
        );
        const upcoming = info.map(({ level, round, contestDate, duration }) => ({
            round,
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
            $and: [
                {
                    contestDate: { $ne: null },
                    $expr: {
                        $lt: [
                            {
                                $add: ["$contestDate", "$duration"],
                            },
                            currentDate,
                        ],
                    },
                },
            ],
        }).populate("problems");
        const past = info.map((contest) => ({
            round: contest.round,
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
        let { level, problems, contestDate, duration } = req.body;
        assertString(level);
        const round = (await Contest.countDocuments()) + 1;
        const contest = new Contest({ level, contestDate, duration, round });
        await contest.save();

        const insertedProblems = [];
        for (const problem of problems) {
            const testCases = problem.testCases.map((testCase) => new TestCase(testCase));
            const insertedTestCases = await TestCase.insertMany(testCases);

            const newProblem = new Problem({
                ...problem,
                contest: contest._id,
                testCases: insertedTestCases.map((tc) => tc._id),
            });

            const savedProblem = await newProblem.save();
            insertedProblems.push(savedProblem);
        }

        const probIds = insertedProblems.map((p) => p._id);
        contest.problems = probIds;
        contest.setter = req.payload.user;
        await contest.save();
        await contest.populate("problems");
        res.status(200).json(contest);
    } catch (err) {
        console.error(err);
        res.status(442).json({
            error: "Scheduling contest failed",
        });
    }
});

router.get("/contest/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const contest = await Contest.findOne({
            round: id,
        }).populate("problems");
        if (!contest) {
            throw new Error("Contest not found");
        } else {
            const current = {
                contestName: `Codeflow ${contest.level} Contest ${contest.round}`,
                problems: contest.problems.map(({ _id, id, title }) => ({
                    _id,
                    id,
                    title,
                })),
                contestDate: contest.contestDate,
                duration: contest.duration,
            };
            res.status(200).json(current);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

export default router;
