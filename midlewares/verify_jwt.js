import jwt from "jsonwebtoken";
import { secretKey } from "../routes/auth.js";

export async function verifyJWT(req, res, next) {
    try {
        const { token } = req.cookies;
        const payload = jwt.verify(token, secretKey);
        req.payload=payload;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            error: "Unauthorized",
        });
    }
}
