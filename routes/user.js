const express = require('express');
const router = express.Router();

const User = require('../model/User');
const {createAuthToken} = User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.get('/:id',auth,async(req,res)=>{

    const user = await User.findById(req.params.id);
    
    res.send(user);
});

router.get('/saved/:id', async(req,res)=>{
    const user = await User.find({_id:global.userIN})
                                                    .populate("saved", "content -_id")
                                                    .select("username");
    res.send(user);
});

router.get('/liked/:id', async(req,res)=>{
    const user = await User.find({_id:global.userIN})
                                                    .populate("liked", "content -_id")
                                                    .select("username");
    res.send(user);
});

// Kayıt ol!
router.post('/signup',async(req,res)=>{

    // const hashedPassword = bcrypt.hash(req.body.password,10).then((data)=>{console.log(data);});
    const hashedPassword = bcrypt.hashSync(req.body.password,10);
    
    let user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    await user.save();
    const token = user.createAuthToken();
    res.header('x-auth-token',token).send(user);
});

// Hesaba giriş yap
router.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    let user = await User.findOne({email:email});
    const check = bcrypt.compareSync(password, user.password);
    if(check){
        req.session.userID = user._id;
        res.send("Şifre doğrulandı!");
    }else{
        res.send("Hatalı şifre!");
    };
});

// Hesaptan çıkış yap
router.post('/logout',async(req,res)=>{
    req.session.destroy(()=> {
        console.log(global.userIN);
        res.send("Uygulamadan çıkış yapıldı!");
      })
})

// Hesap silme!
router.delete('/:id',async(req,res)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    
    res.send('Kullanıcı silindi!');   
    
})

module.exports = router;