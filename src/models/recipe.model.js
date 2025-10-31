const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    chef: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true,
    },
    type: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ingredients: {
        type: [String],
        required: true,
    }, 
    instructions: {
        type: [String],
        required: true,
    }
}, { timestamps: true });

const recipeModel = mongoose.model("Recipe", recipeSchema);

module.exports = recipeModel;
