const userRouter = require("express").Router();
const {
  userLogout,
  userLoginRender,
  getUser,
} = require("../controllers/userController");
const { checkAuth } = require("../middlewares/checkAuth");

userRouter.route("/").get(checkAuth, getUser);

userRouter.route("/login").get(userLoginRender);

userRouter.route("/logout").get(checkAuth, userLogout);

module.exports = userRouter;
