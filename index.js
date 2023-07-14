import { connect } from "mongoose";
import express, { json } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import contestsRouter from "./routes/contests.js";

dotenv.config();

const port = process.env.PORT || 3000;

connect(process.env.MONGODB_URI || "mongodb://localhost/codeflow");

const app = express();

app.use(json());
app.use(cookieParser());
app.use(express.static("dist/"));
app.use("/assets", express.static("assets/"));

app.use("/api", [authRouter, contestsRouter]);

app.listen(port, () => {
    console.log("Server started");
});
