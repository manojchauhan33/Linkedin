const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error during logout" });
  }
};


export { logoutController };
