const cacheInstance = require("../services/cache.service");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const adminMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token)
      return res.status(404).json({
        message: "token not found",
      });

    let isBlacklisted = cacheInstance.get(token);

    if (!isBlacklisted)
      return res.status(404).json({
        message: "token blacklisted",
      });

    let decode = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userModel.findById(decode.id);
    console.log("user-->", user);
  } catch (error) {
    console.log("Error in adminMiddleware");
  }
};

module.exports = adminMiddleware;
