require("dotenv").config();

const checkAuth = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.sendStatus(401);
  // return res.redirect(`http://localhost:${process.env.PORT}/api/v1/auth/google`);
};

module.exports = {
  checkAuth,
};
