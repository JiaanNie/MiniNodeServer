const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2000,
    },
    Editor: Number,
    Admin: Number,
    Tester: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});
// by default when this model create, mongo will look into "users" collection
module.exports = mongoose.model("User", userSchema);
