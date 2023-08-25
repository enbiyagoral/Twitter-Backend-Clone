const User = require('../model/User');
const Tweet = require('../model/Tweet');
const catchAsync = require('../utils/CatchAsync');
const CustomError = require('../utils/CustomError');

exports.createTweet = catchAsync(async(req,res, next)=>{
    throw new CustomError("Hataaa");
    const user = await User.findOne({_id:global.userIN});
    const tweet = new Tweet({
        username: user._id,
        content: req.body.content
    })

    await Promise.all([user.save(),tweet.save()])
                                                .catch(()=>{
                                                    return next(new CustomError("Tweet oluşturulamadı!!"))
                                                });
    
    const s_tweet = await Tweet.findById(tweet._id)
                                            .populate('username','name').select('content likes dislikes saves date');

    res.json({"status":"Başarılı!","message":"Tweet oluşturuldu.","tweet Detayları":s_tweet});   
});

exports.editTweet = catchAsync(async(req,res, next)=>{
    const user = await User.findOne({_id:global.userIN});
    const tweet = await Tweet.findById(req.params.id);
    
    tweet.content= req.body.content;
    
    await Promise.all([user.save(),tweet.save()])
                                                .catch(()=>{
                                                return next(new CustomError("Tweet düzenlenemedi!"))
                                                });

    const s_user = await Tweet.findById(req.params.id)
                                                .populate("username","username")
                                                .select("-createdAt -updatedAt");                                            
    res.send({"status":"Tweet Düzenlendi!","Tweet Detayları":s_user});
});

exports.deleteTweet = catchAsync(async(req,res, next)=>{
    
                                             
    const tweet = await Tweet.findByIdAndDelete(req.params.id)
                                                            .catch(()=>{
                                                                return next(new CustomError("Tweet silinemedi!"));
                                                            });
    const user = await User.findById(global.userIN);
    if(tweet){
        var index = user.tweets.indexOf(req.params.id)
    
        if(index!=-1){
            user.tweets.splice(index,1)
        }else{
            return next(new CustomError("Tweet bulunamadı!"));

        }
    }
    
    const s_user = await Tweet.findById(req.params.id)
    .populate("username","username")
    .select("-createdAt -updatedAt");   

    await user.save().then(()=>{
        res.json({"status":"Başarılı!","message":"Tweet silindi!",s_user});
    });

    
});

exports.actionTweet = catchAsync(async (req, res, next) => {
    const tweet = await Tweet.findById(req.params.id)
        .populate("username", "username")
        .select("-createdAt -updatedAt --v");

    const user = await User.findById(global.userIN);

    if(!user){
        return next(new CustomError("Önce giriş yapmalısınız!"));
    }

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
    } else{
        return next(new CustomError("Like değeri boş kaldı!"));
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
    } else{
        return next(new CustomError("Dislike değeri boş kaldı!"));
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
    }else{
        return next(new CustomError("Save değeri boş kaldı!"));
    }

   
    await Promise.all([user.save(), tweet.save()])
                                                .catch(()=>{
                                                        return next(new CustomError("Like değeri boş kaldı!"))
                                                });


    const updatedTweet = await Tweet.findById(req.params.id)
        .populate("username", "username")
        .select("-createdAt -updatedAt --v");

    res.json({
        "status": "Başarılı!",
        "message": "Aksiyon gerçekleşti",
        "Tweet Bilgileri": updatedTweet
    });
});
