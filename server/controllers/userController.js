const User = require("../db/models/user");
const app = require("../app");

const userLoginRender = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log("_id", _id);
    const user = await User.findById(_id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getUser = async (req, res) => {
  try {
    const userForInit = JSON.parse(JSON.stringify(req.user));
    delete userForInit.googleId;
    delete userForInit.accessToken;
    delete userForInit.googleName;
    delete userForInit.refreshToken;
    res.json(userForInit);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// const userRegister = async (req, res) => {
//   try {
//     const { name, lastName, middleName, phone, email, role } = req.body;
//     if (email && name && lastName && middleName && phone && role) {
//       const newUser = await User.create({
//         name,
//         lastName,
//         middleName,
//         phone,
//         email,
//         role,
//       });
//       return res.json(newUser);
//     }
//     return res.sendStatus(418);
//   } catch (err) {
//     return res.status(500).json(err.message);
//   }
// };

const userLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.redirect("/");

      res.clearCookie(app.get("cookieName"));
      return res.redirect(`${process.env.OUR_URL}`);
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  userLoginRender,
  userLogout,
  getUser,
};
