const User = require('../model/User');
const Tweet = require('../model/Tweet');

async function createTweet(req,res){
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

async function editTweet(req,res){ 
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

async function deleteTweet(req,res){
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
async function actionTweet(req,res){
    const tweet = await Tweet.findById(req.params.id)
        .populate("username","username")
        .select("-createdAt -updatedAt --v");
    const user =  await User.findById(global.userIN);

    const {like,dislike,save} = req.body;   

    const likeAction = tweet.likes.includes(user_id) ? "$pull":"$push";
    const dislikeAction = tweet.dislikes.includes(user._id) ? "$pull" : "$push";
    const saveAction = user.saved.includes(tweet._id) ? "$pull" : "$push";

    if(like!==undefined){
        await User.findByIdAndUpdate(
            user._id,
            {[likeAction] : {liked:tweet._id}},
            {new: true}
        );
        await Tweet.findByIdAndUpdate(
            req.params.id,
            {
                [likeAction]: { likes: user._id },
                $pull: { dislikes: user._id }
            },
            { new: true }
        );
    }
    if (dislike !== undefined) {
        await Tweet.findByIdAndUpdate(
            req.params.id,
            { [dislikeAction]: { dislikes: user._id } },
            { new: true }
        );
    };
    if (save !== undefined) {  
   
        await User.findByIdAndUpdate(
            user._id,
            { [saveAction]: { saved: tweet._id } },
            { new: true }
        );

        await Tweet.findByIdAndUpdate(
            req.params.id,
            { [saveAction]: { saves: user._id } },
            { new: true }
        );
    
    };
    await Promise.all([user.save(), tweet.save()]);

    res.json({"status":"Başarılı!","message":"Aksiyon gerçekleşti","Tweet Bilgileri":tweet});
}
module.exports = {createTweet,editTweet,deleteTweet,actionTweet}