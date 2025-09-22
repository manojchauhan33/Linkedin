import express from "express";
import { signupController } from "../controllers/signup.js";
import { verifyController } from "../controllers/email_verify.js";
import { loginController } from "../controllers/login.js";
import { forgotPasswordController } from "../controllers/forgotPassword.js";
import {resetPasswordController,verifyResetTokenController} from "../controllers/verify_and_resetPassword.js";
import { googleLoginController } from "../controllers/googleLoginController.js";
import { authentication } from "../middlewares/authentication.js";
import { logoutController } from "../controllers/logout.js";
import { getMyProfile, upserProfile } from "../controllers/profileController.js";
import {createPost,getAllPosts,getPostById} from "../controllers/postController.js";
import upload from "../middlewares/upload.js";

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
router.post("/logout", logoutController);
router.post(
  "/profile",
  authentication,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  upserProfile
);
router.get("/profile/me", authentication, getMyProfile);
router.post("/post", authentication, upload.array("media", 10), createPost);
router.get("/getpost",authentication, getAllPosts);

// router.get("/getpostbyid/:id",authentication, getPostById);
// router.put("/updatepost/:id",authentication,upload.single("media"),updatePost);
// router.delete("/deletepost/:id", authentication, deletePost);

export default router;


