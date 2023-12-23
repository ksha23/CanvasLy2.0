const userRouter = require("express").Router();
const {
  getUserSimple,
  setCalendarId,
} = require("../controllers/userController");
const { checkAuth } = require("../middlewares/checkAuth");

// get user data
userRouter.route("/userSimple").get(checkAuth, getUserSimple);

// set calendar ID
userRouter.route("/setCalendarId").put(checkAuth, setCalendarId);

module.exports = userRouter;
