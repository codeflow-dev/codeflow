import { connect } from "mongoose";
import express, { json } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import contestsRouter from "./routes/contests.js";
import problemsRouter from "./routes/problems.js";
import { renderFile } from "ejs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url); // Get the current file's path
const __dirname = dirname(__filename); // Get the current directory name

dotenv.config();

const port = process.env.PORT || 3000;

connect(process.env.MONGODB_URI || "mongodb://localhost/codeflow");

const app = express();

app.use(json());
app.use(cookieParser());

app.use("/api", [authRouter, contestsRouter, problemsRouter]);

app.use(express.static("dist/"));
app.use("/assets", express.static("assets/"));

app.set("view engine", "html");
app.set("views", path.join(__dirname, "dist"));
app.engine("html", renderFile);

app.get("/contest/:id", (req, res) => {
    res.render("contest");
});

app.listen(port, () => {
    console.log("Server started");
});
