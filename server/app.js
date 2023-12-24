/* eslint-disable max-len */
require("dotenv").config();
const flash = require("connect-flash");
const express = require("express");
const sessions = require("express-session");
const MongoStore = require("connect-mongo");
const logger = require("morgan");
const cors = require("cors");
const { connect } = require("mongoose");
const passport = require("passport");
const refresh = require("passport-oauth2-refresh");
const User = require("./db/models/user");
const path = require("path");

const authRouter = require("./routes/auth");
const calendarRouter = require("./routes/calendarRouter");
const assignmentRouter = require("./routes/assignmentRouter");
const usersRouter = require("./routes/usersRouter");

const app = express();

app.set("cookieName", "sid");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

app.use(
  cors({
    origin: `${process.env.OUR_REACT}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Add the necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Add required headers
  })
);

app.use(
  sessions({
    name: app.get("cookieName"),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONNECTION_CLOUD,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 86400 * 1e3,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware to check if the access token is about to expire
const refreshTokenMiddleware = async (req, res, next) => {
  const tokenExpirationBuffer = 60000; // 1 minute buffer for token expiration

  if (
    req.user &&
    req.user.tokenExpiresAt &&
    new Date(req.user.tokenExpiresAt) - tokenExpirationBuffer < Date.now()
  ) {
    console.log("Refreshing token...");
    refresh.requestNewAccessToken(
      "google",
      req.user.refreshToken,
      async (err, accessToken, refreshToken) => {
        if (err) {
          console.error("Error refreshing token:", err);
          return next(err);
        }

        if (!accessToken) {
          console.error("Access token not received after refresh.");
          // Handle this case, possibly by forcing reauthorization or another approach.
          return next(new Error("Failed to obtain a new access token."));
        }

        let userForUpdate = {
          accessToken,
          tokenExpiresAt: new Date().getTime() + 3600000, // adds 1 hour to current time
        };

        if (refreshToken) {
          userForUpdate.refreshToken = refreshToken;
        }

        try {
          await User.findByIdAndUpdate(req.user._id, userForUpdate);
          req.user.accessToken = accessToken; // Update the access token in the user object immediately
          req.user.tokenExpiresAt = userForUpdate.tokenExpiresAt; // Update the token expiration time in the user object immediately
          req.user.refreshToken = refreshToken || req.user.refreshToken; // Update the refresh token in the user object immediately
          console.log("Token refreshed successfully.");
          next();
        } catch (updateErr) {
          console.error("Error updating user:", updateErr);
          next(updateErr);
        }
      }
    );
  } else {
    next();
  }
};

app.use(refreshTokenMiddleware);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/calendar", calendarRouter);
app.use("/api/v1/assignments", assignmentRouter);

const PORT = process.env.PORT ?? 4000;
// const root = require("path").join(__dirname, "../", "client", "build");
// app.use(express.static(root));

app.use(express.static(path.join(__dirname + "/../client/build")));
// app.get("*", (req, res) => {
//   res.sendFile("index.html", { root });
// });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);

  connect(
    process.env.DB_CONNECTION_CLOUD,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => {
      console.log("Connection to databse is successful.");
    }
  );
});

module.exports = app;
