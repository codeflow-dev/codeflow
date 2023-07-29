import User from "../models/user.js";

export async function verifyAdmin(req, res, next) {
    try {
        const user = await User.findById(req.payload.user);
        if (!user.admin) {
            throw new Error("Not admin");
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            error: "Unauthorized",
        });
    }
}
