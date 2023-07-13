import jwt from "jsonwebtoken";

import { secretKey } from "../routes/auth.js";

export async function verifyJWT(req, res, next) {
    try {
        if (!req.headers["authorization"]) {
            return new Error("No Auth Header");
        }
        const token = req.headers["authorization"].split(" ")[1];
        const payload = jwt.verify(token, secretKey);
        req.payload = payload;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            error: "Unauthorized",
        });
    }
}
