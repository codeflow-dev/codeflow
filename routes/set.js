import { Router } from "express";
import { verifyJWT } from "../midlewares/verify_jwt.js";
import User from "../models/user.js";
import { assertStringArray } from "../util.js";
import Submission from "../models/submission.js";

const router = Router();
router.get("/settings", verifyJWT, async (req, res) => {
    try {
        const loggedUser = await User.findById(req.payload.user);

        res.status(200).json({
            name: loggedUser.name,
            username: loggedUser.username,
            email: loggedUser.email,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "User search failed" });
    }
});
router.post("/settings", verifyJWT, async (req, res) => {
    try {
        const { name, username, password, confirmPassword, email } = req.body;
        console.log("Form Data:", name, username, password, confirmPassword, email);
        assertStringArray([name, username, password, confirmPassword, email]);

        const loggedUser = await User.findById(req.payload.user);

        const existingUser = await User.findOne({
            $or: [{ name }, { email }, { username }],
            _id: { $ne: loggedUser._id },
        });

        console.log([existingUser]);
        if (existingUser) {
            let message;
            if (existingUser.name === name) {
                message = "Name already exists";
            } else if (existingUser.email === email) {
                message = "Email already exists";
            } else if (existingUser.username === username) {
                message = "Username already exists";
            }
            console.log(message);
            return res.status(409).json({ message });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Your password and confirm password should be the same!" });
        }

        loggedUser.name = name;
        loggedUser.password = password;
        loggedUser.username = username;
        loggedUser.email = email;
        console.log({ loggedUser });
        await loggedUser.save();

        res.status(200).json({ message: "Profile Updated!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Updation failed" });
    }
});

router.get("/user", verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req.payload.user);
        const solvedProblemsCount = await Submission.find({
            submittedBy: user._id,
            message: "Accepted",
        }).countDocuments();
        const rating = await user.rating();
        let data = {
            rating,
            admin: user.admin,
            contestCount: user.transactions.length,
            solvedProblemsCount,
        };
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

export default router;
