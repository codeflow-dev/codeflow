import { Router } from "express";
import { verifyJWT } from "../midlewares/verify_jwt.js";
import { execa } from "execa";
import { randomBytes } from "crypto";
import { tmpdir } from "os";
import path, { dirname } from "path";
import { readFile, writeFile } from "fs/promises";
import Problem from "../models/problem.js";
import Submission from "../models/submission.js";

const router = Router();

function running(contest) {
    const endTime = new Date(contest.contestDate).getTime() + contest.duration;
    const currentTime = new Date().getTime();
    if (currentTime < endTime) {
        return true;
    } else {
        return false;
    }
}

router.post("/submission", verifyJWT, async (req, res) => {
    try {
        const { code, language, id } = req.body;
        const p = await Problem.findById(id).populate("testCases").populate("contest");
        if (!p) {
            throw new Error("Problem not found");
        }
        const duringContest = running(p.contest);
        const submittedBy = req.payload.id;
        const tmpFileName = path.join(tmpdir(), randomBytes(32).toString("hex") + "." + language);
        await writeFile(tmpFileName, code);
        const submission = new Submission({ code, language, problem: p._id, duringContest, submittedBy });
        let result;
        if (language == "cpp") {
            result = await judgeCpp(tmpFileName, p);
        } else {
            result = { message: "Language not supported" };
        }
        submission.message = result.message;
        await submission.save();
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

async function judgeCpp(tmpFileName, problem) {
    try {
        await execa("g++", [tmpFileName, "-o", tmpFileName + ".bin"]);
    } catch (err) {
        console.error(err);
        return { message: "Compilation Error" };
    }
    for (let i = 0; i < problem.testCases.length; i++) {
        const testCase = problem.testCases[i];
        try {
            const { stdout } = await execa(tmpFileName + ".bin", [], {
                input: testCase.input + "\n",
            });
            if (stdout.trim() != testCase.output.trim()) {
                return { message: `Wrong answer on test case ${i + 1}` };
            }
        } catch (err) {
            console.error(err);
            const { isCanceled } = err;
            if (isCanceled) {
                return { message: `Time limit exceeded on test case ${i + 1}` };
            }
            return { message: `Runtime Error on test case ${i + 1}` };
        }
    }
    return { message: "Accepted" };
}

router.post("/playground", async (req, res) => {
    try {
        const { code, language, input } = req.body;
        const tmpFileName = path.join(tmpdir(), randomBytes(32).toString("hex") + "." + language);
        await writeFile(tmpFileName, code);
        if (language == "cpp") {
            res.status(200).json(await runCpp(tmpFileName, input));
        } else if (language == "py") {
            res.status(200).json(await runPython(tmpFileName, input));
        } else if (language == "java") {
            res.status(200).json(await runJava(tmpFileName, input));
        } else {
            res.status(200).json({
                message: "Language not supported",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

async function runCpp(tmpFileName, input) {
    try {
        await execa("g++", [tmpFileName, "-o", tmpFileName + ".bin"]);
    } catch (err) {
        const { stderr } = err;
        return { message: "Compilation Error", stdout: stderr };
    }
    try {
        const { stdout } = await execa(tmpFileName + ".bin", [], { input });
        return { message: `Success`, stdout };
    } catch (err) {
        const { stderr } = err;
        return { message: `Runtime Error`, stdout: stderr };
    }
}

async function runPython(tmpFileName, input) {
    try {
        const { stdout } = await execa("python3", [tmpFileName], { input });
        return { message: `Success`, stdout };
    } catch (err) {
        const { stderr } = err;
        return { message: `Runtime Error`, stdout: stderr };
    }
}

async function runJava(tmpFileName, input) {
    const code = await readFile(tmpFileName);
    const regex = /public\s+class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/;
    const match = code.toString().match(regex);
    let className;
    if (match && match[1]) {
        className = match[1];
    } else {
        return { message: "Public class not found", stdout: "" };
    }
    tmpFileName = path.join(tmpdir(), className + ".java");
    await writeFile(tmpFileName, code);
    try {
        await execa("javac", [tmpFileName], { cwd: dirname(tmpFileName) });
    } catch (err) {
        const { stderr } = err;
        return { message: "Compilation Error", stdout: stderr };
    }
    try {
        const { stdout } = await execa("java", [className], { cwd: dirname(tmpFileName), input });
        return { message: `Success`, stdout };
    } catch (err) {
        const { stderr } = err;
        return { message: `Runtime Error`, stdout: stderr };
    }
}

export default router;
