    const mongoose = require("mongoose");
    const Joi = require("joi");


    const toySchema = new mongoose.Schema({
        name:String,
        info:String,
        price:Number,
        img_url:{
            type:String, default:""
        },
        category:{
            type:String, default:"General"
        },
        user_id:String

    },{timestamps:true})


    exports.ToyModel = mongoose.model("toys", toySchema);

    exports.validateToy = (_reqbody) =>{
        const joiSchema = Joi.object({
            name:Joi.string().min(2).max(400).required(),
            info:Joi.string().min(2).max(400).required(),
            price:Joi.number().min(1).max(500).required(),
            img_url:Joi.string().min(1).max(10000).allow(null,""),
            category:Joi.string().min(2).max(400).allow(null)
        })
        return joiSchema.validate(_reqbody);
    }




    