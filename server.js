const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./src/config/db");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.routes");
const recipeRoutes = require("./src/routes/recipe.routes");
const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({origin:"http://localhost:5173",credentials:true}));

connectDB();

app.use("/api/auth/user", authRoutes);
app.use("/api/auth/recipe", recipeRoutes);

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
