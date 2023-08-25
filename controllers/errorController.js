const logger = require('../middleware/logger');

module.exports = (error,req,res,next)=>{

    logger.log("error",error.message);


    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error'
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
    });
};