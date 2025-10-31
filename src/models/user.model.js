const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true ,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    recipes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
    }]
    

},{
    timestamps:true
}
);

userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(password){
    let pass = await bcrypt.compare(password, this.password);
    return pass;
}

userSchema.methods.generateToken = function () {
    let token = jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:"1h",
    });
    return token;
  };

  const UserModel = mongoose.model("user",userSchema);

  module.exports = UserModel;