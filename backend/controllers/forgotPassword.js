import User from "../models/user.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Linked_in Clone" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password.</p>
        <a href="${resetUrl}">Click here to reset</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    return res
      .status(200)
      .json({ message: "Password reset link sent to email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export { forgotPasswordController };
