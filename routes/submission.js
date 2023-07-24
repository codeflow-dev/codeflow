import { Router } from "express";
import { verifyJWT } from "../midlewares/verify_jwt.js";
import { execa } from "execa";
import { randomBytes } from "crypto";
import { tmpdir } from "os";
import path from "path";
import { writeFile } from "fs/promises";

const router = Router();

async function compileCpp(tmpFileName) {
    try {
        await execa("g++", [tmpFileName, "-o", tmpFileName + ".bin"]);
    } catch (err) {
        const { stderr } = err;
        return { message: "Compilation Error", stderr };
    }
    try {
        const { stdout } = await execa(tmpFileName + ".bin", [], { input: "5 5" });
        return { message: "Success", stdout };
    } catch (err) {
        const { stderr } = err;
        return { message: "Runtime Error", stderr };
    }
}

router.post("/submission", verifyJWT, async (req, res) => {
    try {
        const { code, language } = req.body;
        const tmpFileName = path.join(tmpdir(), randomBytes(32).toString("hex") + "." + language);
        await writeFile(tmpFileName, code);
        if (language == "cpp") {
            res.status(200).json(await compileCpp(tmpFileName));
        } else {
            res.status(200).json(r);
        }
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
});

export default router;
