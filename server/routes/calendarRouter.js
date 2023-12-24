const calendarRouter = require("express").Router();
const { getEvents } = require("../controllers/calendarController");
const { checkAuth } = require("../middlewares/checkAuth");
const calendarController = require("../controllers/calendarController");

// Route to get all events
calendarRouter.route("/events").get(checkAuth, getEvents);

// Route to get a specific calendar by ID
calendarRouter.get(
  "/calendars/:id",
  checkAuth,
  calendarController.getCalendarById
);

calendarRouter.get(
  "/calendarData",
  checkAuth,
  calendarController.getCalendarData
);

module.exports = calendarRouter;
