const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Tweet = require('../model/Tweet');

router.get('/:id',async(req,res)=>{
    const tweet = await Tweet.findById(req.params.id)
                                                .populate("username","username")
                                                .select("-createdAt -updatedAt --v");
    
    const user = await User.findById(global.userIN);
    const {like,dislike,save} = req.body;

    if(like){
        if(!tweet.likes.includes(global.userIN)){
            tweet.likes.push(global.userIN);
        }
        if(!user.liked.includes(tweet._id)){user.liked.push(tweet._id);};
        
    }else{
        var index = tweet.likes.indexOf(global.userIN);
        var u_index = user.liked.indexOf(tweet._id);
        tweet.likes.splice(index,1);
        user.liked.splice(u_index,1); 
    }

    if(dislike){
        if(!tweet.dislikes.includes(global.userIN)){
            tweet.dislikes.push(global.userIN);  
            user.liked.push(tweet._id);    
        }}
    else{
        var index = tweet.dislikes.indexOf(global.userIN);
        tweet.dislikes.splice(index,1);
    }
    
    

    if(save){
        if(!tweet.saves.includes(global.userIN)){
            tweet.saves.push(global.userIN);
        }
        if(!user.saved.includes(tweet._id)){user.saved.push(tweet._id);};
        
    }else{
        index = tweet.saves.indexOf(global.userIN);
        u_index = user.liked.indexOf(tweet._id);
        tweet.saves.splice(index,1);
        user.saved.splice(u_index,1); 
    }
    
    await user.save();
    await tweet.save();
    res.send(tweet);
});

router.post('/create', async(req,res)=>{
    console.log(global.userIN);  
    const user = await User.findOne({_id:global.userIN});
    console.log(user);
    const tweet = new Tweet({
        username: user._id,
        content: req.body.content
    })
    await tweet.save();
    user.tweets.push(tweet);
    await user.save();
    const s_user = await User.find({_id:global.userIN})
                                                .populate("tweets","content")
                                                .select("-email -password -name -createdAt -updatedAt --v");

    res.send(s_user);
});

router.put('/edit/:id', async(req,res)=>{ 
    const user = await User.findOne({_id:global.userIN});
    const tweet = await Tweet.findById(req.params.id);
    
    tweet.content= req.body.content;
    await tweet.save();
    await user.save();
    const s_user = await Tweet.findById(req.params.id)
                                                .populate("username","username email")
                                                .select("-createdAt -updatedAt");
                                                
    res.send(s_user);
});

router.delete('/edit/:id',async(req,res)=>{
    const tweet = await Tweet.findByIdAndDelete(req.params.id);
    res.send("Tweet silindi!");
});

module.exports = router;