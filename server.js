const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./src/config/db");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.routes");
const recipeRoutes = require("./src/routes/recipe.routes");
const app = express();
const path = require("path");

app.use(express.json());

const __dirname = path.resolve();
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({origin:"https://tastemate05.netlify.app/",credentials:true}));
app.use(express.static(path.join(__dirname, "../recipe/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../recipe/dist/index.html"));
});

connectDB();

app.use("/api/auth/user", authRoutes);
app.use("/api/auth/recipe", recipeRoutes);

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
