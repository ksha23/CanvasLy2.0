const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  googleId: {
    type: String,
  },
  googleName: {
    type: String,
  },
  photo: {
    type: String,
  },
  name: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
});

module.exports = model("User", userSchema);
