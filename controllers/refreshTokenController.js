const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = require('../model/User')
dotenv.config()


const handleRefreshToken = async (req, res) => {
    const cookie = req.cookies
    // optional chaining
    if(!cookie?.jwt) return res.status(401).json({message: "missing cookie"})
    // at this point we have the refresh token
    const token = cookie.jwt
    // going look for a match refresh token in userdb.users
    // const foundUser = userDB.users.find((u)=> u.refreshToken === token)
    console.log(token)
    const foundUser = await User.findOne({refreshToken:token}).exec()
    if(!foundUser) return res.status(401)

    // first we need to make sure the refresh token is vaild
    jwt.verify(
        token, 
        process.env.REFRESH_TOKEN_SECRET,
        (error, decodedToken) => {
            console.log(decodedToken)
            if(error || foundUser.username !== decodedToken.username) res.status(403)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        username: decodedToken.username,
                        roles: Object.values(foundUser.roles)
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '15m'}
            )
            res.status(200).json({"accessToken": accessToken})
        }
    )

}
module.exports = {handleRefreshToken}