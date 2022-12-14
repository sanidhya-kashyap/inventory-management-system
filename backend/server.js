const dotenv =  require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleWare/errorMiddleware")

const app = express()

//middlewares

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());

//Routes Middleware
app.use("/api/users", userRoute);

//Routes
app.get("/", (req,res) =>{
    res.send("Home Page");
});

//Error MiddleWare
app.use(errorHandler);

//connect to mongodb and start server
const PORT = process.env.PORT || 5000;


 mongoose
    .connect(process.env.MONGO_URI)
    .then(() =>{
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((err) => console.log(err))