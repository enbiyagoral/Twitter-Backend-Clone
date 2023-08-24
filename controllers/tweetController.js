const User = require('../model/User');
const Tweet = require('../model/Tweet');
const catchAsync = require('../utils/CatchAsync');


exports.createTweet = catchAsync(async(req,res,next)=>{
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
});

exports.editTweet = catchAsync(async(req,res,next)=>{
    const user = await User.findOne({_id:global.userIN});
    const tweet = await Tweet.findById(req.params.id);
    
    tweet.content= req.body.content;
    
    await Promise.all([user.save(),tweet.save()]);
    const s_user = await Tweet.findById(req.params.id)
                                                .populate("username","username")
                                                .select("-createdAt -updatedAt");                                            
    res.send({"status":"Tweet Düzenlendi!","Tweet Detayları":s_user});
});

exports.deleteTweet = catchAsync(async(req,res,next)=>{
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
});

exports.actionTweet = catchAsync(async (req, res, next) => {
    const tweet = await Tweet.findById(req.params.id)
        .populate("username", "username")
        .select("-createdAt -updatedAt --v");
    const user = await User.findById(global.userIN);

    const { like, dislike, save } = req.body;

    if (like !== undefined) {
        if (like && !tweet.likes.includes(user._id)) {
            await User.findByIdAndUpdate(
                user._id,
                { $push: { liked: tweet._id } },
                { new: true }
            );

            await Tweet.findByIdAndUpdate(
                req.params.id,
                { $push: { likes: user._id }, $pull: { dislikes: user._id } },
                { new: true }
            );
        } else if (!like && tweet.likes.includes(user._id)) {
            await User.findByIdAndUpdate(
                user._id,
                { $pull: { liked: tweet._id } },
                { new: true }
            );

            await Tweet.findByIdAndUpdate(
                req.params.id,
                { $pull: { likes: user._id } },
                { new: true }
            );
        }
    }

    if (dislike !== undefined) {
        if (dislike && !tweet.dislikes.includes(user._id)) {
            await Tweet.findByIdAndUpdate(
                req.params.id,
                { $push: { dislikes: user._id } },
                { new: true }
            );
        } else if (!dislike && tweet.dislikes.includes(user._id)) {
            await Tweet.findByIdAndUpdate(
                req.params.id,
                { $pull: { dislikes: user._id } },
                { new: true }
            );
        }
    }

    if (save !== undefined) {
        if (save && !user.saved.includes(tweet._id)) {
            await User.findByIdAndUpdate(
                user._id,
                { $push: { saved: tweet._id } },
                { new: true }
            );

            await Tweet.findByIdAndUpdate(
                req.params.id,
                { $push: { saves: user._id } },
                { new: true }
            );
        } else if (!save && user.saved.includes(tweet._id)) {
            await User.findByIdAndUpdate(
                user._id,
                { $pull: { saved: tweet._id } },
                { new: true }
            );

            await Tweet.findByIdAndUpdate(
                req.params.id,
                { $pull: { saves: user._id } },
                { new: true }
            );
        }
    }

    await Promise.all([user.save(), tweet.save()]);

    const updatedTweet = await Tweet.findById(req.params.id)
        .populate("username", "username")
        .select("-createdAt -updatedAt --v");

    res.json({
        "status": "Başarılı!",
        "message": "Aksiyon gerçekleşti",
        "Tweet Bilgileri": updatedTweet
    });
});
