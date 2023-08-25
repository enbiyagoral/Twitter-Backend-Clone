const {transports, createLogger, format} = require('winston');
const {combine,prettyPrint,timestamp} = format;
require('winston-mongodb');
const dotenv = require('dotenv');
dotenv.config();


const logger = createLogger({
    format: combine(
        timestamp({
            format: "DD-MMM-YYYY HH:mm:ss" 
        }),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename:"logs/logs.log", level:"error"}),
        new transports.File({filename:"logs/exceptions.log", level:"error",handleExceptions:true,handleRejections:true,maxFiles:"3d"}),
        new transports.MongoDB({
            level: 'error',
            db: process.env.MONGO_URI,
            options: {
                useUnifiedTopology: true
            },
            collection: "server_logs"
        })
    ]
});

process.on("unhandledRejection",(err)=>{
    console.log(err.message);
    logger.log(err.message);
});

process.on("uncaughtException",(err)=>{
    console.log(err.message);
    logger.log(err.message);
})

module.exports = logger;