const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const task = require("../models/Task");
const User = require("../models/usersModel");

// adding the new todo
router.post("/add-todo", authMiddleware, async (req, res) => {

    try {
        const user = await User.findById(req.body.userId);

        const todo = new task({
            title: req.body.title,
            description: req.body.description,
            userId: user._id,
        })
        await todo.save();

        res.send({
            success: true,
            message: "Task Added Successfully"
        })
    } catch (error) {
        res.send({
            success: false,
            message: error,
        })
    }

})

// get all the todos
router.post("/get-all-todo", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body
        console.log(userId)
        let filters = {};

        if(userId){
            filters.userId = userId
        }
        console.log("filters" , filters)

        const todos = await task.find(filters);

        console.log(todos)
        res.send({
            success: true,
            data: todos,
        })
    } catch (error) {
        res.send({
            success: false,
            message: error,
        })
    }
})

// delete todo

router.delete("/delete-todo/:id", authMiddleware, async (req, res) => {
    try {

        const result = await task.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            data: result,
            message: "Task Deleted"
        })

    } catch (error) {
        res.send({
            success: false,
            message: error,
        })
    }
})

// check mark completed or not
router.put("/update-todo/:id", authMiddleware, async (req, res) => {
    try {

        const todo = await task.findById(req.params.id);

        todo.completed = !todo.completed;

        todo.save();

        res.send({
            success: true,
            message: "Task Updated Successfully"
        })

    } catch (error) {
        res.send({
            success: false,
            message: error,
        })
    }
})

module.exports = router