import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token, please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired, please login" });
  }
};

export { authentication };
