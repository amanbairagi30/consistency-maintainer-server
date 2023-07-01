const express = require('express')
const app = express();
app.use(express.json());
require('dotenv').config(); //it is neccessary to get the env variables from .env
const dbConfig = require("./config/dbConfig");


const port = process.env.PORT || 5000;

const usersRoute = require("./routes/usersRoute") 
app.use("/api/users", usersRoute);

const taskRoute = require("./routes/taskroutes") 
app.use("/api/users", taskRoute);

app.listen(port , ()=> console.log(`Node Js server started at ${port}`))

