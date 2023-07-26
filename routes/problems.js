import express from "express";
import Problem from "../models/problem.js";
const router = express.Router();

router.get("/problems", async (req, res) => {
    try {
        const data = await Problem.find().select("_id id title");
        res.status(200).json(data);
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
