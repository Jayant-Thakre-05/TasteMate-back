const mongoose = require("mongoose")

const connectDB = async()=>{
    mongoose.connect(process.env.MONGO_URI)
  .then((res) => console.log(`MongoDB Connected`))
  .catch((err) => {
    console.log("error in connecting db", err);
  });
};
module.exports=connectDB;