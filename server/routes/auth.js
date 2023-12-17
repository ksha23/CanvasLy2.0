const passport = require("../config");
const express = require("express");
require("dotenv").config();

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
    prompt: "select_account",
    accessType: "offline",
    // approvalPrompt: 'force'
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: `${process.env.OUR_REACT}`,
    failureRedirect: `${process.env.OUR_URL}/api/v1/auth/google`,
    failureFlash: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  // res.clearCookie('cookieName');

  // return res.redirect(`${process.env.OUR_URL}`);
  return res.json({ message: "Successfully logged out" });
});

router.get("/user", (req, res) => {
  if (req.user) {
    return res.json({ user: req.user });
  } else {
    return res.json({ user: null });
  }
});

module.exports = router;
