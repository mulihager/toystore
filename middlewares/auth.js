const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async(req,res,next) => {
  const token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({err:"You need send token to this endpoint or url 111"})
  }
  try{
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET);
    req.tokenData = decodeToken;
    next()
  }
  catch(err){
    console.log(err);
    res.status(502).json({err:"Token invalid or expired 222"})
  }
}


exports.authAdmin = async(req,res,next) => {
  const token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({err:"You need send token to this endpoint or url 111"})
  }
  try{
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET);
    if(decodeToken.role != "admin"){
      return res.status(401).json({err:"You must send token of admin to this endpoint"})
    }
    req.tokenData = decodeToken;
    next()
  }
  catch(err){
    console.log(err);
    res.status(502).json({err:"Token invalid or expired 222"})
  }
}