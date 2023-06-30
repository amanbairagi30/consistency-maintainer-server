const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);
// console.log("in db " + process.env.MONGO_URI)
const connection = mongoose.connection;

connection.on('connected' , ()=>{
    console.log("MongoDB connection Successfully")
})


connection.on("error" ,()=>{
    console.log("MongoDB connection failed")
})


module.exports = connection;