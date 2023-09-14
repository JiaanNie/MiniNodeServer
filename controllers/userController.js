const User = require("../model/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
  }
};

// const deleteUser = (req, res) => {};

// const getUser = (req, res) => {};

module.exports = { getAllUsers };
