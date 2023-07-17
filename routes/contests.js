import { Router } from "express";
import { assertString } from "../util.js";
import Contest from "../models/contest.js";
import Problem from "../models/problem.js";
import { verifyJWT } from "../midlewares/verify_jwt.js";
import { verifySetter } from "../midlewares/verify_setter.js";

const router = Router();

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
