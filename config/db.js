require('dotenv').config();
const { default: mongoose } = require("mongoose");

const connectDB=async()=>{
    try
    {
        await mongoose.connect(process.env.DB_URL);
    }
    catch(error){
        console.error("something error in the database",error);
    }
};
connectDB();
module.exports=mongoose;