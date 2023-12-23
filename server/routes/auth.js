const passport = require("../config");
const express = require("express");
require("dotenv").config();

const router = express.Router();

// auth login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
    prompt: "select_account",
    accessType: "offline",
    // approvalPrompt: 'force'
  })
);

// handle the callback after Google has authenticated the user
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    successRedirect: `${process.env.OUR_REACT}`,
    failureRedirect: `${process.env.OUR_URL}/api/v1/auth/google`,
    failureFlash: true,
  })
);

// logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.clearCookie("sid");
  return res.json({ message: "Successfully logged out" });
});

module.exports = router;
