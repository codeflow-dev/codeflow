import express from "express";
import Problem from "../models/problem.js";
const router = express.Router();

router.get("/problems", async (req, res) => {
    try {
        const data = await Problem.find().select("_id title");
        res.status(200).json(data);
    } catch {
        res.status(500).json({
            message: "There was a server side error",
        });
    }
});

export default router;
