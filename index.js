const express = require('express');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
const bcrypt = require('bcrypt');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

// const User = require('./model/User');
// const Tweet = require('./model/Tweet');
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    })
  }));
  
app.use('*', (req, res, next) => {
    userIN = req.session.userID;
    next();
});
  
const userRoute = require('./routes/user');
const tweetRoute = require('./routes/tweet');

// DB CONNECTION

try{
    mongoose.connect(process.env.MONGO_URI).then(()=>{console.log('MONGO DB CONNECTED!');})
}catch(err){
    console.log(err)
};

app.use(express.json());
app.use('/user',userRoute);
app.use('/tweet',tweetRoute);


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`SERVER STARTING ON ${PORT}`);
});

