const mongoose = require("mongoose");
const express = require("express");
const {validateToy, ToyModel, validateUpdateToy} = require("../models/toyModel");
const router = express.Router();
const {auth, adminAuth} = require("../middlewares/auth");


router.get("/", async(req,res) => {
    try{
      //?limit=X&page=X&sort=X&reveres=yes
      const limit = req.query.limit || 10;
      const page = req.query.page - 1 || 0;
      const sort = req.query.sort || "_id";
      const reverse = req.query.reverse == "yes" ? 1 : -1;
  
      let filterFind = {};
      // בודק אם הגיע קווארי לחיפוש ?s=
      if(req.query.s){  
        // "i" - דואג שלא תיהיה בעיית קייססינסטיב
        const searchExp = new RegExp(req.query.s,"i");
        // יחפש במאפיין הטייטל או האינפו ברשומה
        filterFind.$or = [{title:searchExp},{info:searchExp}]

      }
      if(req.query.catname){  
        const searchExp = new RegExp(req.query.catname,"i");
        filterFind.category = searchExp;

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

router.post("/" , auth ,async(req,res) => {
    const validBody = validateToy(req.body)
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      const toy = new ToyModel(req.body);
      // להוסיף מאפיין של יוזר איי די לרשומה
      toy.user_id = req.tokenData._id;
      await toy.save()
      res.status(201).json(toy);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  router.put("/:id", auth, async(req,res) => {
    const validBody = validateToy(req.body)
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      const id = req.params.id;
      // ,user_id:req.tokenData._id - דואג שרק בעל הרשומה יוכל
      // לשנות את הרשומה לפי הטוקן
      const data = await ToyModel.updateOne({_id:id,user_id:req.tokenData._id},req.body);
      // "modifiedCount": 1, אומר שהצליח כשקיבלנו
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  

  router.delete("/:delId", auth, async(req,res) => {
    try{
      const id = req.params.delId;
      // ,user_id:req.tokenData._id - דואג שרק בעל הרשומה יוכל
      // למחוק את הרשומה לפי הטוקן
      const data = await ToyModel.deleteOne({_id:id,user_id:req.tokenData._id});
      // "modifiedCount": 1, אומר שהצליח כשקיבלנו
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })


module.exports = router;