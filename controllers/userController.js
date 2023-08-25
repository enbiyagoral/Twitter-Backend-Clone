const User = require('../model/User');
const {createAuthToken} = User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/CatchAsync');
const CustomError = require('../utils/CustomError');

exports.signUp = catchAsync(async(req,res,next)=>{
    const hashedPassword = bcrypt.hashSync(req.body.password,10);
    
    let user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    await user.save()
    .then(()=>{
        res.json({"status": "Başarılı!","message": "Kullanıcı oluşturuldu!"});
    })
    .catch(()=>{
        return next(new CustomError('Kayıt olunamadı!'));
    });

    
});

exports.login = catchAsync(async(req,res,next)=>{
    const {email,password} = req.body;
    let user = await User.findOne({email:email});
    if(!user){
        return next(new CustomError("E-Mail bulunamadı."))
    }else{
        const check = bcrypt.compareSync(password, user.password);
        if(check){
            req.session.userID = user._id;
            const s_user = await User.findById(user._id).select('name username email');
    
            const token = user.createAuthToken();
            res.header('x-auth-token',token).json({"status": "Başarılı!","message": "Giriş yapıldı!","Kullanıcı Bilgileri":s_user});
        }else{
            return next(new CustomError("E-Mail veya şifre yanlış."))
        };
    }
    
});

exports.logout = catchAsync(async(req,res,next)=>{
    req.session.destroy(()=> {
        res.json({"Status": "Uygulamadan çıkış yapıldı!"});
    });
});

exports.deleteUser = catchAsync(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id)
        .then(()=>{
            res.json({"Status": "Kullanıcı silindi!"});
        }).catch(()=>{
            return next(new CustomError("Kullanıcı silinemedi"));
        })
});

exports.savedTweet = catchAsync(async(req,res,next)=>{
    // CHECK USER
    const user = await User.find({_id:req.params.id})
    .populate("saved", "content -_id")
    .select("username")
    .then(()=>{
        res.json(user);
    })
    .catch(()=>{
        return next(new CustomError("Kullanıcı bulunamadı!"));
    })
    
});

exports.likedTweet = catchAsync(async(req,res,next)=>{
    const user = await User.find({_id:req.params.id})
    .populate("liked", "content -_id")
    .select("username")
    .then(()=>{
        res.json(user);
    })
    .catch(()=>{
        return next(new CustomError("Kullanıcı bulunamadı!"));
    })
});

exports.profile = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    const myUser = await User.findById(global.userIN);
    if(global.userIN == user._id){
        const s_user = await User.findById(req.params.id).populate('tweets','content').select('name username follower followed');
    }else{
        const {follow,unfollow} = req.body;
        if(follow === unfollow || follow==true && unfollow==true){
            res.json({"status: ": "İki işlemi aynı anda yapamazsınız!"});
        } 

        if(follow && unfollow==false){        
        
            if(!myUser.followed.includes(user._id)){ // myuser'in takip ettikleri arasında yoksa alttakileri yap
               myUser.followed.push(user._id);
            }else{
                return next(new CustomError("Takip ediliyor"));
            }
            
            if(!user.follower.includes(myUser._id)){ // user'in takipçileri arasında yoksa alttakileri yap
                user.follower.push(myUser._id);    
            }
        }else if(unfollow && follow==false){
            if(myUser.followed.includes(user._id)){ // takipten çıkacağı kişi takip edilenleri arasında var mı? varsa çalış
                var index = myUser.followed.indexOf(user._id);
                myUser.followed.splice(index,1);
            if(user.follower.includes(myUser._id)){
                index = user.follower.indexOf(myUser._id);
                user.follower.splice(index,1);
            }
           
        }}   
    }
    await Promise.all([myUser.save(),user.save()])
    .then(()=>{
        res.json({"user": user, "my_user": myUser});  
    }).catch(()=>{
        return next(new CustomError("İşlem gerçekleşmedi."));
    })
});  
