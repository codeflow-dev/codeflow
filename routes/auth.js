import { Router } from "express";
import { assertStringArray } from "../util.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();
export const secretKey = process.env.SECRET || "development";

router.post("/login", async (req, res) => {
    try {
        const { login, password } = req.body;
        assertStringArray([login, password]);
        let user;
        if (login.includes("@")) {
            user = await User.findOne({ email: login });
        } else {
            user = await User.findOne({ username: login });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Wrong password");
        }
        const token = jwt.sign({ user: user.id }, secretKey, { expiresIn: "1d" });
        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(401).json({
            error: "Authentication failed",
        });
    }
});

router.post("/signup", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        assertStringArray([name, username, email, password]);
        const uniq1 = await User.findOne({ email });
        const uniq2 = await User.findOne({ username });
        if (uniq1 || uniq2) {
            throw new Error("User already exists");
        }
        const user = new User({ name, username, email, password });
        await user.save();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(401).json({
            error: "Signup failed",
        });
    }
});

export default router;
