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
  if (req.user) {
    console.log(
      "refresh needed?: ",
      req.user.tokenExpiresAt < Date.now() - 60000
    );
  }

  if (req.user && req.user.tokenExpiresAt < Date.now() - 60000) {
    refresh.requestNewAccessToken(
      "google",
      req.user.refresh_token,
      async (err, accessToken, refreshToken) => {
        if (err) {
          console.error(err);
          return next(err);
        }
        let userForUpdate;
        if (refreshToken) {
          userForUpdate = {
            accessToken,
            refreshToken,
            tokenExpiresAt: new Date().getTime() + 3600000, // adds 1 hour to current time
          };
        } else
          userForUpdate = {
            accessToken,
            tokenExpiresAt: new Date().getTime() + 3600000, // adds 1 hour to current time
          };
        await User.findByIdAndUpdate(req.user._id, userForUpdate);
        next();
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
