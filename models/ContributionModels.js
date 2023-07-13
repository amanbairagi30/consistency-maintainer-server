const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,
    },
    completedData: {
        type: Number,
        required: true,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
},{
    timestamps : true,
});


const Contribution = mongoose.model("Contributions", contributionSchema);

module.exports = Contribution;
