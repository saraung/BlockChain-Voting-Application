import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcrypt"
import createToken from '../utils/createToken.js'

const createUser=asyncHandler(async (req,res)=>{
    const {username,email,password,pollingStation}=req.body
    console.log(req.body);

    if(!username|!email|!password||!pollingStation){
        throw new Error("Please fill all the input fields")
    }
     
    const salt =await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)

    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400).send("user already exists")
        return
    }
        
    const newUser= new User({username,email,password:hashedPassword,pollingStation})
    createToken(res,newUser._id)
    try {
        await newUser.save()

        res.status(201).json({_id:newUser._id,username:newUser.username,email:newUser.email,isAdmin:newUser.isAdmin,pollingStation:newUser.pollingStation})
    } catch (error) {
        res.status(400  );
        throw new Error("Invalid User Data")
    }

})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // Check if a user exists with the given email
    const existingUser = await User.findOne({ email });
  
    if (!existingUser) {
      // User not found
      res.status(400).json({ message: "User does not exist" });
      return;
    }
  
    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  
    if (isPasswordValid) {
      // If password is correct, generate a token and send user data
      createToken(res, existingUser._id);
      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
    } else {
      // Invalid password
      res.status(400).json({ message: "Incorrect password. Please try again." });
    }
  });
  

const logoutCurrentUser=asyncHandler(async(req,res)=>{
      res.cookie('jwt','',
        {   httpOnly: true,
            expires:new Date(0)
        }
    );
    res.status(200).json({message:"Logout Succesfully"})
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const getCurrentUserProfile=asyncHandler(async(req,res)=>{
    const user= await User.findById(req.user._id)
    if(user){
        res.json({
            _id:user._id,
            username:user.username,
            email:user.email
        })
    }
    else{
        res.status(404)
        throw new Error("user not found")
    }
})

const updateCurrentUserProfile=asyncHandler(async(req,res)=>{
    const user  =await User.findById(req.user._id)
    if(user){
        user.username=req.body.username || user.username
        user.email=req.body.email || user.email
        user.pollingStation=req.body.pollingStation || user.pollingStation
        
        if(req.body.password){
            const salt =await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(req.body.password,salt)        
            user.password=hashedPassword;
        }

        const updatedUser=await user.save(user)

        res.json({
            _id:updatedUser._id,
            email:updatedUser.email,
            username:updatedUser.username,
            isAdmin:updatedUser.isAdmin
        })
    }
    else{
        res.status(404)
        throw new Error("user not found ")
    }
})


const deleteUserById=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id)

    if(user){
        if(user.isAdmin)
        {
            res.status(400)
            throw new Error("cannot delete admin user")
        }

        await User.deleteOne({_id:user._id})
        res.json({message:"User Removed"})
    }
    else{
        res.status(404)
        throw new Error("user not found ")  
    }
})


const getUserById=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id).select('-password')

    if(user){
        res.json(user)
    }
    else{
        throw new Error("user not found")
    }

})

const updateUserById=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id)
    if(user){

       user.username=req.body.username || user.username
        user.email=req.body.email || user.email
        user.isAdmin=Boolean(req.body.isAdmin)

        const updatedUser=await user.save(user)

        res.json({
            _id:updatedUser._id,
            _username:updatedUser.username,
            email:updatedUser.email, 
            isAdmin:updatedUser.isAdmin
        })

    }
    else{
        res.status(404)
        throw new Error("user not found")
    }
})

export {createUser,loginUser,logoutCurrentUser,getAllUsers,getCurrentUserProfile,updateCurrentUserProfile,deleteUserById,getUserById,updateUserById};