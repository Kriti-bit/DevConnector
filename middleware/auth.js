const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req,res,next) 
{
    //Get Token from header
    const token = req.header('x-auth-token') //'x-auth-token' is the key in POSTMAN

    //Check if no token is there
    if(!token)
    {
        return res.status(401).json({ msg: 'No token, authorisation denied '})
    }

    //If there is a token, we'll verify it
    //Verifying Token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user
        next()
    }catch (err){
        res.status(401).json({ msg: 'Token is not valid'})
    }
}