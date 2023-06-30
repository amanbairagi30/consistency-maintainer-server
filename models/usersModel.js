const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        default : "user"
    },
    status : {
        type : String,
        default : "active"
    },
    verified : {
        type : Boolean,
        default : false,
    },
    profilePic : {
        type : String,
        default : "https://img.icons8.com/?size=512&id=18738&format=png"
    },

},{
    timestamps : true
})

const User = mongoose.model("users",userSchema);
module.exports = User;