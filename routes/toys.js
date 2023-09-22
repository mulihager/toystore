const mongoose = require("mongoose");
const express = require("express");
const {validateToy, ToyModel} = require("../models/toyModel");
const router = express.Router();
const {auth, adminAuth} = require("../middlewares/auth");

//Get toys by filters
router.get("/", async(req,res) => {
    try{
      const limit = req.query.limit || 10;
      const page = req.query.page - 1 || 0;
      const sort = req.query.sort || "_id";
      const reverse = req.query.reverse == "yes" ? 1 : -1;
  
      let filterFind = {};
      if(req.query.s){  
        const searchExp = new RegExp(req.query.s,"i");
        filterFind.$or = [{title:searchExp},{info:searchExp}]

      }
      if(req.query.catname){  
        filterFind.category = req.query.catname;

      }
      const toys = await ToyModel
      .find(filterFind)
      .limit(limit)
      .skip(page * limit)
      .sort({[sort]:reverse})
      res.json(toys);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

//Get count of toys
router.get("/count", async(req,res) => {
  try{
    const limit = req.query.limit || 10;
    const count = await ToyModel.countDocuments({})
    res.json({count,pages:Math.ceil(count/limit)})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})



  //Get a single toy by an id
  router.get("/single/:id", async(req,res)=>{
    try{     
        const toy = await ToyModel.findOne({_id:req.params.id});

        res.status(201).json(toy);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

//Create a new toy
router.post("/" , auth ,async(req,res) => {
    const validBody = validateToy(req.body)
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      const toy = new ToyModel(req.body);
      toy.user_id = req.tokenData._id;
      await toy.save()
      res.status(201).json(toy);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })


  //Update a toy by id
  router.put("/:id", auth, async(req,res) => {
    const validBody = validateToy(req.body)
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      const id = req.params.id;
      const data = await ToyModel.updateOne({_id:id,user_id:req.tokenData._id},req.body);
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  
//Delete a toy by id
  router.delete("/:delId", auth, async(req,res) => {
    try{
      const id = req.params.delId;
      const data = await ToyModel.deleteOne({_id:id,user_id:req.tokenData._id});
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })


module.exports = router;