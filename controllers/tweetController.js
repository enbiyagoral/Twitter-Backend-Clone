const User = require('../model/User');
const Tweet = require('../model/Tweet');

async function CreateTweet(req,res){
    const user = await User.findOne({_id:global.userIN});
    const tweet = new Tweet({
        username: user._id,
        content: req.body.content
    })
    
    await tweet.save();
    user.tweets.push(tweet);
    await user.save();
    
    const s_tweet = await Tweet.findById(tweet._id)
                                            .populate('username','name').select('content likes dislikes saves date');

    res.json({"status":"Başarılı!","message":"Tweet oluşturuldu.","tweet Detayları":s_tweet});   
};

async function EditTweet(req,res){ 
    const user = await User.findOne({_id:global.userIN});
    const tweet = await Tweet.findById(req.params.id);
    
    tweet.content= req.body.content;
    await tweet.save();
    await user.save();
    const s_user = await Tweet.findById(req.params.id)
                                                .populate("username","username")
                                                .select("-createdAt -updatedAt");                                            
    res.send({"status":"Tweet Düzenlendi!","Tweet Detayları":s_user});
};

async function DeleteTweet(req,res){
    const s_user = await Tweet.findById(req.params.id)
                                                    .populate("username","username")
                                                    .select("-createdAt -updatedAt");                                            
    const tweet = await Tweet.findByIdAndDelete(req.params.id);
    const user = await User.findById(global.userIN);
    var index = user.tweets.indexOf(req.params.id)

 
    if(index!=-1){
        user.tweets.splice(index,1)
    }else{
        res.json({"status":"Hata!","message":"Tweet silinemedi!",s_user})
    }

    await user.save();
    res.json({"status":"Başarılı!","message":"Tweet silindi!",s_user});
}
async function ActionTweet(req,res){
    const tweet = await Tweet.findById(req.params.id)
                                                .populate("username","username")
                                                .select("-createdAt -updatedAt --v");
    
    const user = await User.findById(global.userIN);
    const {like,dislike,save} = req.body;

    if(like){
        var index = tweet.likes.indexOf(global.userIN)
        if(index==-1){
            if(!(tweet.likes.includes(global.userIN))){
                tweet.likes.push(global.userIN);
            }
            if(!user.liked.includes(tweet._id)){
                user.liked.push(tweet._id);
            };
        }
    }else{
        var index = tweet.likes.indexOf(global.userIN);
        var u_index = user.liked.indexOf(tweet._id);
        tweet.likes.splice(index,1);
        user.liked.splice(u_index,1); 
    }

    if(dislike){
        var index = tweet.likes.indexOf(global.userIN)
        if(index==-1){
            if(!tweet.dislikes.includes(global.userIN)){
                tweet.dislikes.push(global.userIN);  
                user.liked.push(tweet._id);    
            }}
        }  
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

    res.json({"status":"Başarılı!","message":"Aksiyon gerçekleşti","Tweet Bilgileri":tweet});
}
module.exports = {CreateTweet,EditTweet,DeleteTweet,ActionTweet};