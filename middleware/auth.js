const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(401).send('Yetkiniz yok!');
    };

    try {
        const decodedToken = jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        req.user = decodedToken;
        console.log(req.user)
        next();
    } catch (ex) {
        res.status(400).send('Hatalı token!');
    };
    
}

