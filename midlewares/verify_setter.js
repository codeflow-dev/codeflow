import User from "../models/user.js";

export async function verifySetter(req, res, next) {
    try {
        const user = await User.findById(req.payload.user);
        if ((await user.rating()) < 100) {
            if (!user.admin) {
                throw new Error("Not setter");
            }
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            error: "Unauthorized",
        });
    }
}
