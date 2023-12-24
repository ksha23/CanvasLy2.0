const { calendar } = require("googleapis/build/src/apis/calendar");
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
  tokenExpiresAt: {
    type: Date,
  },
  refreshToken: {
    type: String,
  },
  calendarId: {
    type: String,
  },
});

module.exports = model("User", userSchema);
