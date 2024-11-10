require('dotenv').config();

const mongoose=require('mongoose');

const MONGO_URI=process.env.MONGO_URI


const connectToMongo = () => {
    mongoose.connect(MONGO_URI)
        .then(() => console.log("MongoDB Connected...."))
        .catch((e) => {
            console.error("MongoDB connection error:", e);
        });
};


module.exports=connectToMongo