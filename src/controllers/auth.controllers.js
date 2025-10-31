const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cacheInstance = require("../services/cache.service");
const resetPassTemplate = require("../utils/email.Template");
const sendMail = require("../services/mail.services");


const registerController = async (req, res) => {
  try {
    let { fullname,email,mobile ,password } = req.body;

    let existingUser = await userModel.findOne({ email });


    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Let mongoose pre-save hook hash the password
    let newUser = await userModel.create({
      fullname,
      email,
      mobile,
      password,
    });


    let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered",
      user: newUser,
    });
  } catch (error) {
    console.log("error in registration->", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;


    if (!email || !password) {
      return res.status(500).json({
        message: "all fields are required",
      });
    }


    let user = await userModel.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    let comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass)
      return res.status(401).json({
        message: "Invalid Credentials",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    return res.status(200).json({
      message: "user logged in",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    let token = req.cookies.token;

    if (!token)
      return res.status(404).json({
        message: "Token not found",
      });

    await cacheInstance.set(token, "blackListed");

    res.clearCookie("token");
    return res.status(200).json({
      message: "user logged out",
    });
  } catch (error) {
    console.log("error in logout", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    let { email } = req.body;

    if(!email)
        return res.status(400).json({
      message:"email not found"
      });

    let user = await userModel.findOne({
      email
    });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    let resetToken = jwt.sign({ id: user._id }, process.env.JWT_RAW_SECRET, {
      expiresIn: "10m",
    });

    let resetLink = `http://localhost:3000/api/auth/reset-password/${resetToken}`;

    let resetTemp = resetPassTemplate(user.email, resetLink);

    let emailData = await sendMail(
      user.email,
      "Reset password",
      resetTemp
    );

    return res.status(200).json({
      message: "Reset link send",
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error,
    });
  }
};

const updatePasswordController = async (req, res) => {
    try {
      const user_id = req.params.id;
      const { password, confirmPassword } = req.body;
  
      console.log("password from ejs:", password);
      console.log("confirm password from ejs:", confirmPassword);
      console.log("user_id:", user_id);
  
      if (!user_id)
        return res.status(404).json({ message: "User ID not found" });
  
      if (!password || !confirmPassword)
        return res.status(400).json({ message: "Password and confirm password are required" });
  
      if (password !== confirmPassword)
        return res.status(400).json({ message: "Passwords do not match" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const updateUser = await userModel.findByIdAndUpdate(
        user_id,
        { password: hashedPassword },
        { new: true } 
      );
  
      if (!updateUser)
        return res.status(404).json({ message: "User not found" });
  
      return res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
      console.error("Error in updatePasswordController:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  };
  
const resetPasswordContoller = async (req,res)=>{

  let token  = req.params.token;
  if(!token)return res.status(404).json({
    message:"token not found"
  })  

  let decode  = jwt.verify(token , process.env.JWT_RAW_SECRET)
  if(!decode)
    return res.status(404).json({
      message:"token not found"
    })
  return res.render("index.ejs",{user_id:decode.id})
 };


module.exports = { registerController, loginController ,logoutController , forgotPasswordController , updatePasswordController , resetPasswordContoller};
  