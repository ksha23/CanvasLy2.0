const User = require("../db/models/user");

// Get user info
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

// Set calendar ID
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

const getWeights = async (req, res) => {
  // Get weights from user object
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { dueDateWeight, difficultyWeight, typeWeight } = user;
  return res.json({ dueDateWeight, difficultyWeight, typeWeight });
};

const setDueDateWeight = async (req, res) => {
  // Set due date weight in user object
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.dueDateWeight = req.body.dueDateWeight;
  await user.save();
  return res.json({ message: "Due date weight updated" });
};

const setDifficultyWeight = async (req, res) => {
  // Set difficulty weight in user object
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.difficultyWeight = req.body.difficultyWeight;
  await user.save();
  return res.json({ message: "Difficulty weight updated" });
};

const setTypeWeight = async (req, res) => {
  // Set type weight in user object
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.typeWeight = req.body.typeWeight;
  await user.save();
  return res.json({ message: "Type weight updated" });
};

const setWeights = async (req, res) => {
  // Set all weights in user object
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.dueDateWeight = req.body.dueDateWeight;
  user.difficultyWeight = req.body.difficultyWeight;
  user.typeWeight = req.body.typeWeight;
  await user.save();
  return res.json({ message: "Weights updated" });
};

module.exports = {
  getUserSimple,
  setCalendarId,
  getWeights,
  setDueDateWeight,
  setDifficultyWeight,
  setTypeWeight,
  setWeights,
};
