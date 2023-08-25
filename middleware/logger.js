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
        new transports.File({filename:"logs.log", level:"error"}),
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

module.exports = logger;