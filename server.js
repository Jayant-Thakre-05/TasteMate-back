const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./src/config/db");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.routes");
const recipeRoutes = require("./src/routes/recipe.routes");
const path = require("path");
const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({origin:"https://tastemate05.netlify.app/",credentials:true}));

connectDB();

// Serve frontend build (Vite dist) with correct MIME types
const distPath = path.join(__dirname, "..", "recipe", "dist");
app.use(express.static(distPath, {
  setHeaders(res, p) {
    if (p.endsWith('.mjs') || p.endsWith('.js')) res.type('application/javascript');
    if (p.endsWith('.wasm')) res.type('application/wasm');
  }
}));

app.use("/api/auth/user", authRoutes);
app.use("/api/auth/recipe", recipeRoutes);

// SPA fallback for non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
