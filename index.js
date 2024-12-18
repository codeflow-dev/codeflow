import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { renderFile } from "ejs";
import express, { json } from "express";
import { connect } from "mongoose";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import admin from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import contestsRouter from "./routes/contests.js";
import problemsRouter from "./routes/problems.js";
import settingsRouter from "./routes/set.js";
import submissionRouter from "./routes/submission.js";

import codeShareRouter from "./routes/codeShare.js";
import { updateProblemRatings, updateUserRatings } from "./routes/rating.js";
import User from "./models/user.js";

const __filename = fileURLToPath(import.meta.url); // Get the current file's path
const __dirname = dirname(__filename); // Get the current directory name

dotenv.config();

const port = process.env.PORT || 3000;

connect(process.env.MONGODB_URI || "mongodb://localhost/codeflow").then(async () => {
    try {
        const admins = await User.find({"admin": true});
        if (admins.length > 0) {
            console.log("Admin already exists");
        } else {
            const admin = new User({
                name: 'Admin',
                email: 'admin@admin.com',
                username: 'admin',
                password: 'admin',
                setter: true,
                admin: true,
                transactions: []
            });
            await admin.save();
            console.log("Admin username: admin");
            console.log("Admin password: admin");
        }
    } catch (e) {
        console.log("Error creating admin");
        console.log(e);
    }
});

const app = express();

app.use(json());
app.use(cookieParser());

app.use("/api", [authRouter, contestsRouter, problemsRouter, submissionRouter, settingsRouter, codeShareRouter, admin]);

app.use(express.static("dist/"));
app.use("/assets", express.static("assets/"));

app.set("view engine", "html");
app.set("views", path.join(__dirname, "dist"));
app.engine("html", renderFile);

app.get("/contest/:id", (req, res) => {
    res.render("contest");
});

app.get("/problem/:id", (req, res) => {
    res.render("problem");
});

// await updateUserRatings("64c4fa24cd035fb470b3e80b");
// await updateProblemRatings("64c4fa24cd035fb470b3e80b");

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
