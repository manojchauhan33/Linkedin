import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.googleId && !user.password) {
      return res.status(400).json({
        message:
          "This account was created with Google. Please login using Google.",
      });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export { loginController };
