const productModel = require("../models/products.model");
const sendfilesToStorage = require("../services/storage.services");

const createProductController = async (req, res) => {
  try {
    let { title, description, amount, currency } = req.body;

    if (!req.files || !req.files.length)
      return res.status(400).json({
        message: "Images required",
      });

    if (!title || !description || !amount || !currency) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    let uploadImgUrl = await Promise.all(
      req.files.map(async (elem) => {
        return await sendfilesToStorage(elem.buffer, elem.originalname);
      })
    );
    console.log("uploadImgUrl", uploadImgUrl);

    let newProduct = await productModel.create({
      title,
      description,
      price: {
        amount,
        currency,
      },
      images: uploadImgUrl.map((elem) => elem.url),
      seller: req.user._id,
    });
    return res.status(201).json({
      message: "product created",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const allProducts = await productModel.find({});

    if (!allProducts)
      return res.status(400).json({
        message: "something went wrong",
      });
    if (allProducts.length == 0)
      return res.status(404).json({
        message: "product not found",
      });

    return res.status(200).json({
      message: "products fetched",
      product: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error,
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    const product_id = req.params.product_id;
    if (!product_id)
      return res.status(404).json({ message: "Product id not found" });

    const product = await productModel.findById(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ownership check
    if (!req.user || product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, description, amount, currency } = req.body;

    let uploadedImg;
    if (req.files && req.files.length > 0) {
      uploadedImg = await Promise.all(
        req.files.map(elem => sendfilesToStorage(elem.buffer, elem.originalname))
      );
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      product_id,
      {
        title: title || product.title,
        description: description || product.description,
        price: {
          amount: amount || product.price.amount,
          currency: currency || product.price.currency,
        },
        images: uploadedImg ? uploadedImg.map(elem => elem.url) : product.images,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log("Error in update:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const deleteProductController = async (req, res) => {
  try {
    const product_id = req.params.product_id;
    if (!product_id)
      return res.status(404).json({ message: "Product id not found" });

    const product = await productModel.findById(product_id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });


    if (!req.user || product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this product" });
    }

    await productModel.findByIdAndDelete(product_id);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in delete:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createProductController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
};