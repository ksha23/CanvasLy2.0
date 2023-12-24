const userRouter = require("express").Router();
const {
  getUserSimple,
  setCalendarId,
  getWeights,
  setDueDateWeight,
  setDifficultyWeight,
  setTypeWeight,
  setWeights,
} = require("../controllers/userController");
const { checkAuth } = require("../middlewares/checkAuth");

// get user data
userRouter.route("/userSimple").get(checkAuth, getUserSimple);

// set calendar ID
userRouter.route("/setCalendarId").put(checkAuth, setCalendarId);

// get weights
userRouter.route("/weights").get(checkAuth, getWeights);

// set due date weight
userRouter.route("/dueDateWeight").put(checkAuth, setDueDateWeight);

// set difficulty weight
userRouter.route("/difficultyWeight").put(checkAuth, setDifficultyWeight);

// set type weight
userRouter.route("/typeWeight").put(checkAuth, setTypeWeight);

// set all weights
userRouter.route("/weights").put(checkAuth, setWeights);

module.exports = userRouter;
