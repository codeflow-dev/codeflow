import { connect } from "mongoose";
import express, { json } from "express";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

connect(process.env.MONGODB_URI || "mongodb://localhost/codeflow");

const app = express();

app.use(json());

app.use("/api", [authRouter]);

app.listen(port, () => {
    console.log("Server started");
});
