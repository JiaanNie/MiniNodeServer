// don't user arrow function this.uers=data will not work
// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function(data) {this.users = data}
// }
// const fsPromises = require('fs').promises
// const path = require('path')
const bcrypt = require("bcrypt");
const User = require("../model/User");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "missing username or password" });
  }
  // first check if the request body has the username and password

  // we need check if the db already contain the user
  // userDB.users is an array of object where each contain username and hasedPassword
  const foundUser = await User.findOne({ username: username }).exec();
  if (foundUser)
    return res.status(409).json({ message: "username already exist!" });

  // create new users
  try {
    const result = await User.create({
      username: username,
      password: await bcrypt.hash(password, 10),
      refreshToken: "",
    });
    // userDB.setUsers([...userDB.users, newUser])
    // await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users))
    return res
      .status(200)
      .json({ message: `User ${username} has been created!` });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleNewUser };
