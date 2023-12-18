const mongoose = require("mongoose");

// Schema for calendars
const calendarSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  googleCalendarId: {
    type: String,
    unique: true,
  },
  customCalendarId: {
    type: String,
  },
  assignments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
  ],
});

const Calendar = mongoose.model("Calendar", calendarSchema);

module.exports = Calendar;
