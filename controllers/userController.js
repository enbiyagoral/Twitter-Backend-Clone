const User = require('../model/User');
const {createAuthToken} = User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function SignUp(req,res){

    const hashedPassword = bcrypt.hashSync(req.body.password,10);
    
    let user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    await user.save();

    res.json({"status": "Başarılı!","message": "Kullanıcı oluşturuldu!"});
}

async function Login(req,res){
    const {email,password} = req.body;
    let user = await User.findOne({email:email});
    const check = bcrypt.compareSync(password, user.password);
    if(check){
        req.session.userID = user._id;
        const s_user = await User.findById(user._id).select('name username email');

        const token = user.createAuthToken();
        res.header('x-auth-token',token).json({"status": "Başarılı!","message": "Giriş yapıldı!","Kullanıcı Bilgileri":s_user});
    }else{
        res.json({"status": "Hata!","message": "Email veya şifre yanlış"});
    };
}

async function Logout(req,res){   
    req.session.destroy(()=> {
        res.json({"Status": "Uygulamadan çıkış yapıldı!"});
    });
}

async function DeleteUser(req,res){
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({"Status": "Kullanıcı silindi!"});
}

async function SavedTweet(req,res){

    const user = await User.find({_id:global.userIN})
                                                        .populate("saved", "content -_id")
                                                        .select("username");
    res.json(user);
}

async function LikedTweet(req,res){
    const user = await User.find({_id:global.userIN})
                                                    .populate("liked", "content -_id")
                                                    .select("username");
    res.json(user);
}

async function Profile(req,res){
    const user = await User.findById(req.params.id);
    const myUser = await User.findById(global.userIN);
    if(global.userIN == user._id){
        const s_user = await User.findById(req.params.id).populate('tweets','content').select('name username follower followed');
        res.json({"user":s_user});
    }else{

        const {follow,unfollow} = req.body;
        if(follow === unfollow || follow==true && unfollow==true){
            res.json({"status: ": "İki işlemi aynı anda yapamazsınız!"});
        } 

        if(follow && unfollow==false){        
        
            if(!myUser.followed.includes(user._id)){ // myuser'in takip ettikleri arasında yoksa alttakileri yap
               myUser.followed.push(user._id);
               await myUser.save();
            }else{
                console.log("Takip ediliyor!");
            }
            if(!user.follower.includes(myUser._id)){ // user'in takipçileri arasında yoksa alttakileri yap
                user.follower.push(myUser._id);
                await user.save();         
            }
            res.json({"user": user, "my_user": myUser});
        }else if(unfollow && follow==false){
            if(myUser.followed.includes(user._id)){ // takipten çıkacağı kişi takip edilenleri arasında var mı? varsa çalış
                var index = myUser.followed.indexOf(user._id);
                myUser.followed.splice(index,1);
                await myUser.save();
            if(user.follower.includes(myUser._id)){
                index = user.follower.indexOf(myUser._id);
                user.follower.splice(index,1);
                await user.save();
            }
            res.json({"user": user, "my_user": myUser});  
        }}   
    }
};



    
     

module.exports = {SignUp, Login, Logout, DeleteUser, SavedTweet, LikedTweet, Profile};