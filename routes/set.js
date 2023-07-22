import { Router } from "express";
import { verifyJWT } from "../midlewares/verify_jwt.js";
import User from "../models/user.js";
import { assertStringArray } from "../util.js";

const router = Router();

router.post("/settings", verifyJWT, async (req, res) => {
  try {
    const { name, userName, newPassword, confirmPassword, email } = req.body;
    console.log("Form Data:", name, userName, newPassword, confirmPassword, email);
    assertStringArray([name, userName, newPassword, confirmPassword, email]);

    const loggedUser = req.payload.user;

    const existingUser = await User.findOne({
      $or: [{ name }, { email }, { userName }],
      _id: { $ne: loggedUser._id }, 
    });

    if (existingUser) {
      let message;
      if (existingUser.name === name) {
        message = "Name already exists";
      } else if (existingUser.email === email) {
        message = "Email already exists";
      } else if (existingUser.username === userName) {
        message = "Username already exists";
      }
      return res.status(409).json({ message });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Your password and confirm password should be the same!" });
    }

    loggedUser.name = name;
    loggedUser.password = newPassword;
    loggedUser.username = userName;
    loggedUser.email = email;
    await loggedUser.save();

    res.status(200).json({ message: "Profile Updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Updation failed" });
  }
});

export default router;

