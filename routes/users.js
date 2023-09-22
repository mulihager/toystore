const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require('bcrypt');
const {UserModel, validateUser, validateLogin, createToken} = require("../models/userModel");
const {auth, authAdmin} = require("../middlewares/auth");
const router = express.Router();


// User Signup
router.post("/", async(req,res) => {
    const validBody = validateUser(req.body)
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      const user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password,10);
      await user.save();
      user.password = "******";
      res.status(201).json(user);
    }
    catch(err){
      if(err.code == 11000){
        return res.status(400).json({err:"Email already in system",code:11000})
      }
      console.log(err);
      res.status(502).json({err})
    }
  })

  //Login User
  router.post("/login", async(req,res) => {
    const validBody = validateLogin(req.body)
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      const user = await UserModel.findOne({email:req.body.email});
      if(!user){
        return res.status(401).json({err:"Email not found!"});
      }
      const validPass = await bcrypt.compare(req.body.password, user.password)
      if(!validPass){
        return res.status(401).json({err:"Password not match"});
      }
  
      const token = createToken(user._id, user.role)
      res.json({token,role:user.role})
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
    
  })




module.exports = router;