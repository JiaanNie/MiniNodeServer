const bcrypt = require("bcrypt");
const fsPromises = require("fs").promises;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../model/User");
dotenv.config();

// this route handler handle user login
// first check if the request body contain username and passward
// if does not return 400
// check if user exist in the db
// if does not reutn 400
// check if the password matches with the user
// if does not match return 400
// otherwise return 200 and a message

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username and password are required!" });

  //find the users
  // const foundUser = userDB.users.find((u)=>{
  //     if(u.username === username) {
  //         return u
  //     }
  // })
  const foundUser = await User.findOne({ username }).exec();
  console.log(foundUser);

  if (!foundUser) return res.status(401).json({ message: "unauthorized" });
  // vaildate the password
  if (!(await bcrypt.compare(password, foundUser.password)))
    return res.status("401").json({ message: "Unauthorized" });

  // create jwt here

  // create access token
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: Object.values(foundUser.roles),
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10s" }
  );

  // create refresh token
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  // after creating two tokens we want to update the user's refresh token
  await foundUser.updateOne({ refreshToken });

  // const otherUsers = userDB.users.filter((u)=> u.username !== foundUser.username)
  // const currentUser = {...foundUser, "refreshToken": refreshToken}
  // userDB.setUsers([...otherUsers, currentUser])
  // await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(userDB.users))
  //when user login we added refresh token so we can cross reference
  // when you deleting the cookie you also need to pass in the same options, however  maxAge and expiredIn are the only option you do need to added in the option
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: `success login for user ${username}`,
    accessToken: accessToken,
    roles: Object.values(foundUser.roles),
  });
};

module.exports = { handleLogin };
