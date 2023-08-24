module.exports = function catchAsync(func){
    return function(req,res,next){
        try{
            func(req,res);
        }catch(err){
            next(err);
        };
    };
};