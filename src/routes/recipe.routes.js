const express = require("express");
const router = express.Router();
const uploads = require("../config/multer")
const authMiddleware = require("../middlewares/auth.middleware");

const {
    createRecipeController,
    getAllRecipesController,
    updateRecipeController,
    deleteRecipeController,
} = require("../controllers/recipe.controllers");

router.post("/create",uploads.array("images", 5), authMiddleware, createRecipeController);
router.get("/allrecipes", getAllRecipesController);
router.put("/update/:recipe_id", authMiddleware, updateRecipeController);
router.delete("/delete/:recipe_id", authMiddleware, deleteRecipeController);

module.exports = router;
