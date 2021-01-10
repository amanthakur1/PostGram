const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types


const userschema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
        type: String,
        default:"https://res.cloudinary.com/amanthakur/image/upload/v1610050808/npro_ujsdvj.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
});

mongoose.model("User", userschema);