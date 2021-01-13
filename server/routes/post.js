const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model("Post");

// fetch all post from db-------------------------------
router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
})
// fetch all post from db-------------------------------
// fetch all post from db-------------------------------
router.get('/myfeed',requireLogin,(req,res)=>{
    // if postedBy in followng list or same person
    Post.find({$or : [
        {postedBy:{$in: req.user.following}},
        {postedBy: req.user._id} 
    ] })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>{
        console.log(err);
    })
})
// fetch all post from db-------------------------------

// creating a post -------------------------------
router.post('/createpost',requireLogin, (req,res)=>{
    const {title, body, pic} = req.body;
    console.log(title,body,pic);
    if(!title || !body || !pic){
        return res.status(422).json({error : "Please Fill all fields.."});
    }
    // console.log(req.user);
    // res.send("Ok");
    req.user.password=undefined;
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy : req.user
    })
    post.save().then(result=>{
        res.json({post : result});
    })
    .catch(err=>{
        console.log(err);
    })
})
// creating a post -------------------------------

// fetching all my posts for profile -------------------------------
router.get('/mypost',requireLogin, (req, res)=>{
    Post.find({postedBy : req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost});
    })
    .catch(err=>{
        console.log(err);
    })
})
// fetching all my posts for profile -------------------------------

// like unlike route----------------

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")

    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result);
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")

    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result);
        }
    })
})


// like unlike route----------------

// comment route -------------------------
router.put('/comment',requireLogin,(req,res)=>{
    const comment ={
        text:req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments: comment}
    },{
        new:true
    })
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result);
        }
    })
})

// comment route -------------------------

// Delete Post Route---------------------

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err});
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        }
    })
})

// Delete Post Route---------------------


// Delete Comment Route --------------------- 

router.delete("/deletecomment/:id/:comment_id", requireLogin, (req, res) => {
    const comment = { _id: req.params.comment_id };
    Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { comments: comment },
      },
      {
        new: true, 
      }
    )
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .exec((err, postComment) => {
    if (err || !postComment) {
        return res.status(422).json({ error: err });
    } else {
        
        const result = postComment;
        res.json(result);
    }
    });
});

// Delete Comment Route --------------------- 


module.exports = router;