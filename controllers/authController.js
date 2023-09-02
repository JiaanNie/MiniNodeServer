const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const bcrypt = require('bcrypt')

// this route handler handle user login
// first check if the request body contain username and passward
// if does not return 400
// check if user exist in the db
// if does not reutn 400
// check if the password matches with the user
// if does not match return 400
// otherwise return 200 and a message 

const handleLogin = async (req, res) => {
    const {username, password} = req.body
    if(!username || !password) return res.status(400).json({'message': 'username and password are required!'})

    //find the users
    const foundUser = userDB.users.find((u)=>{
        u.username === username
        return u
    })
    console.log(foundUser, username, userDB.users)
    if(!foundUser) return res.status(404).json({'message': 'user not found'})
    if(!foundUser.password === await bcrypt.compare(password, foundUser.password)) return res
        .status('400')
        .json({'message': 'invalid login credentails'})
    
    return res.status(200).json({'message': `success login for user ${username}`})
}

module.exports = {handleLogin}