import express from "express";
import { signupController } from "../controllers/signup.js";
import { verifyController } from "../controllers/email_verify.js";
import { loginController } from "../controllers/login.js";
import { forgotPasswordController } from "../controllers/forgotPassword.js";
import {
  resetPasswordController,
  verifyResetTokenController,
} from "../controllers/verify_and_resetPassword.js";
import { googleLoginController } from "../controllers/googleLoginController.js";
import { authentication } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/signup", signupController); //signup
router.get("/verify/:token", verifyController); //signUp verify
router.post("/login", loginController); //login
router.post("/forgot", forgotPasswordController); //forgot
router.get("/reset-password/:token", verifyResetTokenController); //forgot verify
router.post("/reset-password/:token", resetPasswordController); //reset password
router.post("/google", googleLoginController); //continiue with google
router.get("/check-auth", authentication, (req, res) => {
  res.json({ user: req.user });
});

export default router;
