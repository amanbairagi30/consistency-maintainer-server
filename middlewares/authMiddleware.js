const jwt = require("jsonwebtoken")

module.exports = (req,res,next)=>{
    try {
        // get the token
        const token = req.header("authorization").split(" ")[1];
        const decrpytedToken = jwt.verify(token , process.env.JWT_SECRET);
        req.body.userId = decrpytedToken.userId;
        next();
    } catch (error) {
        res.send({
            success: false,
            message : error.message
        })
    }
}