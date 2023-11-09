const {secret} = require('../config');
const jwt = require('jsonwebtoken');
const verification = function (req, res, next) {
    const {token} = req.body;
    try {
        
    const decoded = jwt.verify(token, secret, { ignoreExpiration: false });
    
    req.decoded = decoded
    }catch(e){
        res.status(502).json({error:"your JWT token is invalid or expired"});
        
    }
    next()
}
module.exports =verification