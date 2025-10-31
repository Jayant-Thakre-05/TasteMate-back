const productModel = require("../models/products.model")
const userModel = require("../models/user.model")

const getAllUsersController = async (req,res)=>{

    try {
        let allUsers = await userModel.find({}).select("-password");
        if(!allUsers == allUsers.length)
            return res.status(400).json({
        message:"user not found, Something went wrong"
            })
            return res.status(200).json({
                message:"user fethced",
                users:allUsers
            })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error,
          });
        
    }
}

const getAllProductsController = async (req, res) => {
    try {
      const allProducts = await productModel.find({})
          .populate("seller", "fullname email mobile");
  
      if (!allProducts || allProducts.length === 0) {
        return res.status(404).json({
          message: "No products found",
        });
      }
  
      return res.status(200).json({
        message: "Products fetched successfully",
        products: allProducts,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  
  

const deleteProductController = async(req,res)=>{
    try {
        
    let product_id = req.params.product_id;

    if(!product_id)
        return res.status(404).json({
    message:"product id not found"
    })

    const delProduct = await productModel.findByIdAndDelete(product_id)
    return res.status(200).json({
        message:"product delete successfully"
    })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error,
          });
    }
}

module.exports = {getAllUsersController,getAllProductsController,deleteProductController}