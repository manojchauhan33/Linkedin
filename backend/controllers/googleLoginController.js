import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLoginController = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "No credential provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ where: { email } });

    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId: sub,
        isVerified: true,
        role: "user",
      });
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
      message: "Google login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};

export { googleLoginController };
