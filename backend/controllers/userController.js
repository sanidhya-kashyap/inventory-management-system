const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    return JWT.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
};

//register user

const registerUser =  asyncHandler( async (req, res) => {
   const {name, email, password} = req.body

   //Validation 
   if (!name || !email || !password) {
    res.status(400)
    throw new Error("Please fill in all require fields")
   }
   if (password.length < 6) {
    res.status(400)
    throw new Error("Password must be greater than 6 characters")
   }

   // chcek if user email already exists
   const userExists = await User.findOne({email})

   if (userExists) {
    res.status(400)
    throw new Error("Email already exists")
   }


   // create new user
   const user = await User.create({
    name,
    email,
    password,
   });

      // generate token 
      const token = generateToken(user._id);

      //send HTTP-only cookie 
      res.cookie("token", token, {
        path:  "/",
        httpOnly: true,
        expires:new Date(Date.now() + 1000 * 86400),  // 1 day
        sameSite: "none",
        secure: true
      })

   if (user) {
    const {_id, name, email, photo, phone, bio} = user
    res.status(201).json({
        _id, name, email, photo, phone, bio, token,
        
    })
   } else {
    res.status(400) 
    throw new Error("Invalid User Data") 
   }
});

// Login user
const loginUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body

    // validate request 
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password");
    }
    // Check if user exists
    const user = await User.findOne({email})
    if (!user) {
        res.status(400);
        throw new Error("User not found, Please sign up");
    }

    // Password correct or not

    const passwordIsCorect = await bcrypt.compare(password, )
     
});

module.exports = {
    registerUser,
    loginUser,
}