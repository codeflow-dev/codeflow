import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { json } from "express";
import { connect } from "mongoose";
import authRouter from "./routes/auth.js";
import contestsStatusRouter from "./routes/contestStatus.js";
import contestsRouter from "./routes/contests.js";
dotenv.config();

const port = process.env.PORT || 3000;

connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/codeflow");

const app = express();

app.use(json());
app.use(cookieParser());
app.use(contestsStatusRouter)

app.use("/api", [authRouter, contestsRouter]);

app.listen(port, () => {
    console.log("Server started");
});
