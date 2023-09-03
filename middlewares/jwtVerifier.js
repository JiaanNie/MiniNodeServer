const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
const verifyJWT = async (req, res, next) => {

    const authHeader = req.headers['authorization']
    if(!authHeader) return res.status(401).json({message: 'unauthorizes'})
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
        if(error) {
            return res.sendStatus(403)
        }
        // what is the purpose of this line?
        req.username  = decodedToken.UserInfo.username
        req.roles = decodedToken.UserInfo.roles
        next()
    })
    
}
module.exports = {verifyJWT }