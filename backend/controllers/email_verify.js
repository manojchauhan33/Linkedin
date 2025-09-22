import User from "../models/user.js";

const verifyController = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ where: { verificationToken: token } });

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  if (user.tokenExpires < Date.now()) {
    return res.status(400).json({ message: "Token expired" });
  }

  user.isVerified = true;
  // user.verificationToken = undefined;
  // user.tokenExpires = undefined;

   user.verificationToken = null;
  user.tokenExpires = null;
  await user.save();

  res
    .status(200)
    .json({ message: "Email verified successfully-> Now you can log in " });
};

export { verifyController };
