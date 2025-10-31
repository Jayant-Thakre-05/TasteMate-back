const express = require("express")
const adminMiddleware = require("../middlewares/admin.middleware")
const {getAllUsersController} = require("../controllers/admin.controllers");
const { getAllProductsController, deleteProductController,updateProductController } = require("../controllers/product.controllers");

const router = express.Router();

router.get("/users",adminMiddleware,getAllUsersController)
router.get("/products",adminMiddleware,getAllProductsController )
router.delete("/delete-product/:product_id",adminMiddleware,deleteProductController,updateProductController)

module.exports = router;