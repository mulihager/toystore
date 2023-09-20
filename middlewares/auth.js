const jwt = require("jsonwebtoken");
require("dotenv").config();

// פונקציית מיידלוואר / אמצעית
exports.auth = async(req,res,next) => {
  const token = req.header("x-api-key");
  // בודק שנשלח טוקן בהידר
  if(!token){
    return res.status(401).json({err:"You need send token to this endpoint or url 111"})
  }
  try{
    // מנסה לפענח את הטוקן אם הוא לא בתוקף
    // או שיש טעות אחרת נעבור לקץ'
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET);
    // נעביר את המידע של הטוקן כמאפיין לריק
    // מכיוון שהמשתנה שלו זהה לחלוטין בזכרון לריק של הפונקציה
    // הבאה בשרשור של הראוטר
    req.tokenData = decodeToken;
    // לעבור בפונקציה הבאה בתור בשרשור של הרואטר
    next()
  }
  catch(err){
    console.log(err);
    res.status(502).json({err:"Token invalid or expired 222"})
  }
}


// אימות לאדמין
exports.authAdmin = async(req,res,next) => {
  const token = req.header("x-api-key");
  // בודק שנשלח טוקן בהידר
  if(!token){
    return res.status(401).json({err:"You need send token to this endpoint or url 111"})
  }
  try{
    // מנסה לפענח את הטוקן אם הוא לא בתוקף
    // או שיש טעות אחרת נעבור לקץ'
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET);
    // בודק אם המשתמש לא אדמין כדי להחזיר שגיאה
    if(decodeToken.role != "admin"){
      return res.status(401).json({err:"You must send token of admin to this endpoint"})
    }
    // נעביר את המידע של הטוקן כמאפיין לריק
    // מכיוון שהמשתנה שלו זהה לחלוטין בזכרון לריק של הפונקציה
    // הבאה בשרשור של הראוטר
    req.tokenData = decodeToken;
    // לעבור בפונקציה הבאה בתור בשרשור של הרואטר
    next()
  }
  catch(err){
    console.log(err);
    res.status(502).json({err:"Token invalid or expired 222"})
  }
}