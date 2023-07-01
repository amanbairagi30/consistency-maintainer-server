const router = require("express").Router();
const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Token = require("../models/Token");
const crypto = require("crypto");
const EmailHandler = require("../utils/EmailHandler");



// new registration
router.post("/register", async (req, res) => {
    try {

        // Check if user already exists
        const user = await User.findOne({ email: req.body.email });
        if (user) {

            throw new Error("user Already exists");
            // we can use both , i.e above throw and below return method to show error 

            // return res.send({
            //     success : false,
            //     message : "User already exists"
            // })
        }

        // hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword;

        // create and saving user

        console.log("before creating")
        const newUser = new User(req.body);
        let myuser = await newUser.save();

        // create verification token
        const token = new Token({
            userId: myuser._id,
            token: crypto.randomBytes(16).toString("hex"),
        });

        await token.save();
        console.log(token)

        const link = `http://localhost:3000/users/confirm/${token.token}`

        await EmailHandler(myuser.email, link , 1)

        res.send({
            success: true,
            message: `User Created Successfully and email has been sent to ${myuser.email}`,
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

// activate account
router.get("/confirm/:token", async (req, res) => {
    try {

        const token = await Token.findOne({
            token: req.params.token,
        })
        console.log(token);

        // const verifyToken = jwt.verify(req.params.token, process.env.JWT_SECRET);

        // console.log(verifyToken)
        // if (!verifyToken) {
        //     throw new Error("Token has been expired")
        // }

        await User.updateOne({ _id: token.userId }, { $set: { verified: true } });

        await Token.findByIdAndRemove(token._id);

        res.send({
            success: true,
            message: "Email Verified"
        })

    } catch (error) {
        res.send({
            success: false,
            message: "Unable to activate your account"
        })
    }
})

//login

// user login api endpoint
router.post("/login", async (req, res) => {
    try {
        // Check if user already exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {

            throw new Error("user not found");

            // we can use both , i.e above throw and below return method to show error 

            // return res.send({
            //     success : false,
            //     message : "User not found"
            // })
        }

        // if user is active 
        if (user.status != "active") {
            throw new Error("This User account is blocked , Please Contact at admin456@gmail.com")
        }

        if (!user.verified) {
            throw new Error("Please Verify Email")
        }

        // compare password


        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword) {
            throw new Error("Invalid Password");
        }

        // create and assigning the token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);


        // sending response

        res.send({
            success: true,
            message: "User Logged In Successfully",
            data: token
        });

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})


// get current user
router.post("/get-current-user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        res.send({
            success: true,
            message: "User Fetched Successfully",
            data: user,
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})


// send email 
router.post("/send-email", async (req, res) => {
    const { email } = req.body;
    console.log(email)

    const myuser = await User.findOne({ email: req.body.email });
    if (!myuser) {

        throw new Error("user not found");
    }
    // create verification token
    console.log("before token and  link")

    const token = new Token({
        userId: myuser._id,
        token: crypto.randomBytes(16).toString("hex"),
    });

    // // token generate for reset password
    // const token = jwt.sign({ _id: userfind._id }, keysecret, {
    //     expiresIn: "120s"
    // });

    await token.save();
    console.log(token)
    console.log("Before link")

    const link = `http://localhost:3000/users/${myuser._id}/reset-password/${token.token}`
    console.log("After link")

    await EmailHandler(myuser.email, link , 2)


    res.send({
        success: true,
        message: `Reset link has been sent to ${myuser.email}`
    })
})


// reset password
router.put("/:id/reset-password/:token", async (req, res) => {

    const { id, token } = req.params;
    const {password} = req.body;

    // verifiying token
    try {
        
        // const verifyToken = jwt.verify(req.params.token, process.env.JWT_SECRET);

        // console.log(verifyToken)
        // if (!verifyToken) {
        //     throw new Error("Token has been expired")
        // }

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password , salt)
     
        console.log(newPassword)
        
        const setNewPass = await User.findByIdAndUpdate({_id : id} , {password : newPassword})
        console.log("after setPass")
        setNewPass.save();

        res.send({
            success: true,
            message: "Your password has been updated",
        })

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }

})

module.exports = router;   // if we donot write this then error will be of ROuter.use() misiing middlewware