const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    completed : {
        type : Boolean,
        default : false,
    },
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true,
    }

},{
    timestamps : true,
})

const task = mongoose.model("task" , taskSchema)

module.exports = task;