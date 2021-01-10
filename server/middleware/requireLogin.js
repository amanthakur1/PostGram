const { json } = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");

const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req,res, next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error : "You must have Logged In First.."});
    }
    const token = authorization.replace("Bearer ","");
    jwt.verify(token, JWT_SECRET, (err,payload)=>{
        if(err){
            return res.status(401).json({error : "You must have Logged In.."});
        }
        const {_id} = payload;
        User.findById(_id).then(userdata=>{
            req.user = userdata;
            next()
        })
        
    })
}