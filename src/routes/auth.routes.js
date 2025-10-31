const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  forgotPasswordController,updatePasswordController, resetPasswordContoller
} = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/home", authMiddleware, (req, res) => {
  return console.log("okk me in hu");
});


router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.post("/forgot-password", forgotPasswordController);
router.post("/update-password/:id",updatePasswordController)
router.get("/reset-password/:token", resetPasswordContoller);

module.exports = router;