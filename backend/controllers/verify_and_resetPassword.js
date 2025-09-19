import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";  

const verifyResetTokenController = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }, 
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.status(200).json({ message: "Valid token. Proceed to reset password." });
  } catch (err) {
    console.error("verifyResetTokenController error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Both password fields required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful. You can log in now." });
  } catch (err) {
    console.error("resetPasswordController error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export { verifyResetTokenController, resetPasswordController };
