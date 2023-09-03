// don't user arrow function this.uers=data will not work
const userDB = {
    users: require('../model/users.json'),
    setUsers: function(data) {this.users = data}
}
const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleLogout = async (req, res) => {
    // for frontend need to delete the access token
    const cookie = req.cookies
    console.log(cookie)
    if(!cookie?.jwt) return res.sendStatus(204)

    const refreshToken = cookie.jwt
    const foundUser = userDB.users.find((u)=> u.refreshToken === refreshToken)
    if(!foundUser) {
        // clear cookie when clearing cookie you need to pass in the same option that you have set perviously
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204) // no content
    }
    // delete the refresh token in the db that is related to the user
    const updatedUser = {...foundUser, refreshToken: ''}
    const otherUsers = userDB.users.filter((u)=> u.refreshToken !== refreshToken )
    userDB.setUsers([...otherUsers, updatedUser])
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users))
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.status(200).json({message: "user has been sign off"})

}

module.exports = {handleLogout}