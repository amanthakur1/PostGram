const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const crypto = require('crypto');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');

// email ----nodemailer
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth : {
        api_key : "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"
    }
}))


// // email ----nodemailer




// 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

// router.get('/',(req,res)=>{
//     res.send("hello");
// });
// router.get('/protected',requireLogin, (req,res)=>{
//     res.send("Hello User...");
// })

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body;
    
    if(!name || !email || !password){
        return res.status(422).json({error: "Please fill all the Fields..."});
    }   

    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error: "User Already Exists..."});
        }

        bycrypt.hash(password, 12)
        .then((hashedPassword)=>{
            const user = new User({
                email,
                password: hashedPassword,
                name
            })
            user.save()
            .then((user)=>{
                
                transporter.sendMail({
                    to:user.email,
                    from:"ac247453@gmail.com",
                    subject:"Successfully Signed Up",
                    html:"<h1>Welocome, Account created Successfully..</h1>"
                })
                
                res.json({message:"SignUp Successful..."});
            })
            .catch((err)=>{
                console.log("[ERROR] SignUp",err);
                // res.json({message:"SignUp successful"});
            })
        })
    })
    .catch((err)=>{
        console.log("[ERROR]",err);
    });

    console.log("Signup success");
    res.json({message: "Successfully SignedUp..."});
    // console.log(req.body);
});

router.post('/signin',(req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        res.status(422).json({ error : "please fill all details"})
    }
    User.findOne({email: email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error : "Invalid Email or Password.."})
        }

        bycrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message : "Successfully Signed In.."})
                const token = jwt.sign({ _id : savedUser._id}, JWT_SECRET);
                const {_id, name, email, followers,following,pic} = savedUser;
                res.json({token, user:{ _id, name, email,followers,following,pic} });
            }
            else{
                return res.status(422).json({error : "Invalid Email or Password.."})
            }
        })
        .catch(err=>{
            console.log(err)
        })

    })
})

// for restting password --------------
// send mail
router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User not Exists.."})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"ac247453@gmail.com",
                    subject:"Password Reset",
                    html:
                    `
                    <p>You can change your password here.</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({message:"Please check your Mail..."})
            })

        })
    })
})

// store in db
router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password;
    const sentToken = req.body.token;

    User.findOne({resetToken: sentToken, expireToken:{$gt : Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error : "Try again, Session Expired.."})
        }
        bycrypt.hash(newPassword,12).then(hashedPassword=>{
            user.password = hashedPassword ;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then(savedUser=>{
                res.json({message : "Password Updated Successfully.." })
            })
        })
    }).catch(err=>{
        console.log(err);
    })
})

// for restting password --------------

module.exports = router;