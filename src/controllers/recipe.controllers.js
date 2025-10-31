const recipeModel = require("../models/recipe.model");
const sendfilesToStorage = require("../services/storage.services");


const createRecipeController = async (req,res)=>{
    try {
        let {title,chef,type,description,ingredients,instructions} = req.body;

        if (!req.files || !req.files.length)
      return res.status(400).json({
        message: "Images required",
      });
        if(!title || !description || !ingredients || !chef || !type || !instructions){
            return res.status(400).json({
                message:"all fields are required"
            })
        }

        let uploadImgUrl = await Promise.all(
            req.files.map(async (elem) => {
              return await sendfilesToStorage(elem.buffer, elem.originalname);
            })
          );
          console.log("uploadImgUrl", uploadImgUrl);

          let newRecipe = await recipeModel.create({
            title,
            chef,
            type,
            description,
            ingredients,
            instructions,
            images: uploadImgUrl.map((elem) => elem.url),
          });
          return res.status(201).json({
            message: "recipe created",
            recipe: newRecipe,
          });
    } catch (error) {
        return res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
};

const getAllRecipesController = async (req,res)=>{
    try {
        const allRecipes = await recipeModel.find({}).populate("chef", "fullname email");

        if (!allRecipes)
          return res.status(400).json({
            message: "something went wrong",
          });
        if (allRecipes.length == 0)
          return res.status(404).json({
            message: "recipe not found",
          });

        return res.status(200).json({
          message: "recipes fetched",
          recipe: allRecipes,
        });
      } catch (error) {
        console.log("Error in getAllRecipes:", error);
        return res.status(500).json({
          message: "Internal server error",
          error: error.message,
        });
      }
};

const updateRecipeController = async (req,res)=>{
    try {
        const recipe_id = req.params.recipe_id;
        if (!recipe_id)
          return res.status(404).json({
            message: "recipe id not found",
          });
          const recipe = await recipeModel.findById(recipe_id);
          if (!recipe)
            return res.status(400).json({
              message: "recipe not found",
            });

            // Ownership check
            if (!req.user || recipe.chef.toString() !== req.user._id.toString()) {
              return res.status(401).json({ message: "Not authorized" });
            }

            let {title,chef,type,description,ingredients,instructions} = req.body;

        let uploadedImg;
         if (req.files && req.files.length > 0) {
        uploadedImg = await Promise.all(
        req.files.map(elem => sendfilesToStorage(elem.buffer, elem.originalname))
        );
         }
    
    const updatedRecipe = await recipeModel.findByIdAndUpdate(
      recipe_id,
      {
        title: title || recipe.title,
        chef: chef || recipe.chef,
        type: type || recipe.type,
        description: description || recipe.description,
        ingredients: ingredients || recipe.ingredients,
        instructions: instructions || recipe.instructions,
        images: uploadedImg ? uploadedImg.map(elem => elem.url) : recipe.images,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Recipe updated successfully",
      updatedRecipe,
    });
      } catch (error) {
        console.log("Error in updateRecipe:", error);
        return res.status(500).json({
          message: "Internal server error",
          error: error.message,
        });
      }
}

const deleteRecipeController = async (req,res)=>{
    try {
        const recipe_id = req.params.recipe_id;
        if (!recipe_id)
          return res.status(404).json({
            message: "recipe id not found",
          });
          
          const recipe = await recipeModel.findById(recipe_id);
          if (!recipe)
            return res.status(400).json({
              message: "recipe not found",
            });
        
        if (!req.user || recipe.chef.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: "Not authorized to delete this recipe" });
        }
        
        await recipeModel.findByIdAndDelete(recipe_id);

        return res.status(200).json({ message: "Recipe deleted successfully" });
        
      } catch (error) {
        console.log("Error in deleteRecipe:", error);
        return res.status(500).json({
          message: "Internal server error",
          error: error.message,
        });
      }
}

module.exports = {
    createRecipeController,
    getAllRecipesController,
    updateRecipeController,
    deleteRecipeController
}