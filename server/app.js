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
// const googleConfig = require("./config");

// const User = require("./db/models/user");

const authRouter = require("./routes/auth");
// const usersRouter = require("./routes/usersRouter");
const calendarRouter = require("./routes/calendarRouter");
const assignmentRouter = require("./routes/assignmentRouter");

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

app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/users", usersRouter);
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
