const CustomError = require("../utils/CustomError");

module.exports = function(req,res,next){

    const checkUser = req.params.id == global.userIN ? true:false;
    if(checkUser){
        next();
    }else{
        return next(new CustomError("Yetkiniz yok.",401))
    };
};

//