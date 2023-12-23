const User = require("../db/models/user");

const getUserSimple = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    // remove access token and refresh token from user object
    user.accessToken = undefined;
    user.refreshToken = undefined;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error(error);
  }
};

// Set calendar ID by user ID
const setCalendarId = async (req, res) => {
  const { calendarId } = req.body;
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.calendarId = calendarId;
    await user.save();
    res.json({ message: "Calendar ID updated" }); // Send the response here
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" }); // Handle errors and send appropriate responses
  }
};

module.exports = {
  getUserSimple,
  setCalendarId,
};
