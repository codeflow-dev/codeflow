import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { json } from "express";
import { connect } from "mongoose";
import authRouter from "./routes/auth.js";
import contestsRouter from "./routes/contests.js";
import problemsRouter from "./routes/problems.js";
import settingsRouter from "./routes/set.js";
dotenv.config();

const port = process.env.PORT || 3000;

connect(process.env.MONGODB_URI || "mongodb://localhost/codeflow");

const app = express();

app.use(json());
app.use(cookieParser());

app.use("/api", [authRouter, contestsRouter, problemsRouter, settingsRouter]);

app.listen(port, () => {
    console.log("Server started");
});
