const express = require("express");
const uploads = require("../config/multer");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  createProductController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
} = require("../controllers/product.controllers");

const router = express.Router();

router.post("/create", uploads.array("images", 5), authMiddleware, createProductController);
router.get("/products", getAllProductsController);
router.put("/update/:product_id", authMiddleware, uploads.array("images", 5), updateProductController);
router.delete("/delete/:product_id", authMiddleware, deleteProductController);

module.exports = router;