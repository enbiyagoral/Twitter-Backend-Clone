const express = require('express');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
const bcrypt = require('bcrypt');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./controllers/errorController');
const logger = require('./middleware/logger');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

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
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        logger.info("MONGO DB CONNECTED!");
    })
}catch(err){
    const error = new CustomError("CONNECTION FAILED",404)
    logger.error("CONNECTION FAILED");
    next(error);
};

app.use(express.json());
app.use('/user',userRoute);
app.use('/tweet',tweetRoute);
app.all('*',(req,res,next)=>{
    const err = new CustomError(`cannot find ${req.originalUrl} on the server!`,404)
    next(err);
})
app.use(globalErrorHandler);
const PORT = process.env.PORT || 3000;



app.listen(PORT,()=>{
    logger.info(`SERVER STARTING ON ${PORT}`);
});

