const UnauthorizedError = require("../errors/unauthorized-error");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError("No token provided!");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");

    req.user = user;
    // req.user = {
    //   userId: payload.id,
    //   name: payload.name,
    // };
    next();
  } catch (error) {
    throw new UnauthorizedError("Authentication failed!");
  }
};

module.exports = authMiddleware;
