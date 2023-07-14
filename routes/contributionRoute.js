const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Contribution = require("../models/ContributionModels");
const User = require("../models/usersModel");

router.post("/add-contributions/:payload", authMiddleware , async(req,res)=>{
    try {
        const user = await User.findById(req.body.userId);
        
        const contribute = new Contribution({
            date: new Date(),
            completedData : req.params.payload,
            userId: user._id,
        })

        await contribute.save();


        res.send({
            success : true,
            message : "Your " + req.params.payload +" task completeion progress has been stored for today",
            data : contribute,
        })

    } catch (error) {
        res.send({
            success : false,
            message : error
        })
    }
})


// get contributions
router.post("/get-contributions", authMiddleware , async(req,res)=>{
    try {

        const { userId } = req.body

        let filters = {};

        if(userId){
            filters.userId = userId
        }
        console.log("filters" , filters)


        const contribute = await Contribution.find(filters);

        res.send({
            success : true,
            message : "Your data fetched successfully",
            data : contribute,
        })

    } catch (error) {
        res.send({
            success : false,
            message : error
        })
    }
})

module.exports = router;