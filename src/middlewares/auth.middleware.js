const userModel = require("../models/user.model");
const cacheInstance = require("../services/cache.service");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token)
      return res.status(404).json({
        message: "token not found",
      });

    let isblacklisted = await cacheInstance.get(token);
    if (isblacklisted)
      return res.status(400).json({
        message: "token blacklisted",
      });

    let decode = jwt.verify(token, process.env.JWT_SECRET);

    let user = await userModel.findById(decode.id);

    if (!user)
      return res.status(404).json({
        message: "user not found",
      });

      req.user=user;
      next()
  } catch (error) {
    return res.status(500).json({
      message: "error in middleware",
      error: error,
    });
  }
};

module.exports = authMiddleware;