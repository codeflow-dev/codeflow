import express from "express";
import Problem from "../models/problem.js";
import Submission from "../models/submission.js";
const router = express.Router();

router.get("/problems", async (req, res) => {
    try {
        let data = await Problem.find().populate("contest");
        let result = [];
        const currentDate = new Date();
        for (let i = 0; i < data.length; i++) {
            const { contestDate, duration } = data[i].contest;
            if (data[i].contest.published && new Date(contestDate).getTime() + duration < currentDate) {
                const solvedBy = await Submission.find({ problem: data[i]._id, message: "Accepted" }).countDocuments();
                let r = {
                    _id: data[i]._id,
                    id: data[i].id,
                    title: data[i].title,
                    rating: data[i].rating,
                    round: data[i].contest.round,
                    solvedBy,
                };
                result.push(r);
            }
        }
        // console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
});

router.get("/problem/:id", async (req, res) => {
    try {
        let problem = await Problem.findById(req.params.id).populate("testCases");
        problem.testCases = problem.testCases.splice(0, 2);
        res.status(200).json(problem);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "There was a server side error",
        });
    }
});

export default router;
