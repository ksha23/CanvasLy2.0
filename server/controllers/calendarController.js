const fetch = require("node-fetch");
const refresh = require("passport-oauth2-refresh");
const User = require("../db/models/user");
const Calendar = require("../db/models/calendar");
const Assignment = require("../db/models/assignment");
const { DateTime } = require("luxon");

// ----------------- HELPERS --------------------

// create calendar if one with the same calendarId doesn't exist
const createCalendar = async (data) => {
  try {
    const calendar = await Calendar.findOne({
      googleCalendarId: data.googleCalendarId,
    });
    if (!calendar) {
      const newCalendar = await Calendar.create(data);
      return newCalendar;
    } else {
      return calendar;
    }
  } catch (error) {
    console.error(error);
  }
};

const createAssignments = async (calendarId, data) => {
  try {
    // Extract names from incoming data for comparison
    const assignmentNames = data.map((assignment) => assignment.name);

    // Find existing assignments by name
    const existingAssignments = await Assignment.find({
      name: { $in: assignmentNames },
    });

    // Filter out existing assignments
    const existingAssignmentNames = existingAssignments.map(
      (assignment) => assignment.name
    );
    const newAssignmentsData = data.filter(
      (assignment) => !existingAssignmentNames.includes(assignment.name)
    );

    // Insert new assignments (if any)
    const newAssignments = await Assignment.insertMany(newAssignmentsData);

    if (calendarId) {
      const calendar = await Calendar.findOne({ googleCalendarId: calendarId });
      if (!calendar) {
        return { message: "Calendar not found" };
      }

      // Extract IDs of newly created assignments
      const assignmentIds = newAssignments.map((assignment) => assignment._id);

      // Add valid assignmentIds to the calendar's assignments field
      calendar.assignments.push(...assignmentIds);

      await calendar.save();
    }

    return newAssignments;
  } catch (error) {
    console.error(error);
  }
};

//create many assignments and associate them with a calendar
// const createAssignments = async (calendarId, data) => {
//   try {
//     // only create assignments that don't already exist
//     const existingAssignments = await Assignment.find({
//       name: { $in: data.map((assignment) => assignment.name) },
//     });
//     const existingAssignmentNames = existingAssignments.map(
//       (assignment) => assignment.name
//     );
//     data = data.filter(
//       (assignment) => !existingAssignmentNames.includes(assignment.name)
//     );

//     const newAssignments = await Assignment.insertMany(data);

//     if (calendarId) {
//       const calendar = await Calendar.findOne({ googleCalendarId: calendarId });
//       if (!calendar) {
//         return { message: "Calendar not found" };
//       }

//       // Extract only the IDs of newly created assignments
//       const assignmentIds = newAssignments.map((assignment) => assignment._id);
//       // Add valid assignmentIds to the calendar's assignments field
//       calendar.assignments.push(...assignmentIds);

//       await calendar.save();
//     }

//     return newAssignments;
//   } catch (error) {
//     console.error(error);
//   }
// };

// Get assignments belonging to a specific calendar
const getAssignmentsByCalendarId = async (calendarId) => {
  try {
    const calendar = await Calendar.findOne({
      googleCalendarId: calendarId,
    }).populate("assignments");
    if (!calendar) {
      console.error("Calendar not found");
    }
    return calendar.assignments;
  } catch (error) {
    console.error(error);
  }
};

// handles post-processing of data from Google Calendar API
/*
1. Create calendar in database if it doesn't exist
2. get assignments belonging to the calendar (basically refresh the calendar with new assignments)
3. Save events to database if they don't already exist (also associate them with the calendar)
4. Filter out completed assignments
5. Add any other filters here!!!!!
6. Sort assignments
7. Send back _id, name, dueDate, completed, and reminders array
*/
const postProcess = async (data, googleId, timeZone) => {
  // create calendar in database if it doesn't exist
  const calendarData = {
    googleId: googleId,
    googleCalendarId: process.env.GOOGLE_CALENDAR_ID2,
    assignments: [],
  };

  await createCalendar(calendarData);

  const newData = data.map((event) => ({
    name: event.summary,
    dueDate: event.start.dateTime || event.start.date,
  }));

  // for each assignment, if its dueDate does not have a time, set the time to 11:59 PM and set to UTC time
  newData.forEach((assignment) => {
    if (!assignment.dueDate.includes("T")) {
      assignment.dueDate = DateTime.fromISO(assignment.dueDate, {
        zone: timeZone,
      })
        .set({ hour: 23, minute: 59 })
        .toUTC()
        .toISO();
    }
  });

  // save events to database if they don't already exist (also associate them with the calendar)
  await createAssignments(process.env.GOOGLE_CALENDAR_ID2, newData);

  // ----------------- FILTERS --------------------
  const assignments = await getAssignmentsByCalendarId(
    process.env.GOOGLE_CALENDAR_ID2
  );

  // filter out completed assignments
  const filteredAssignments = assignments.filter(
    (assignment) => !assignment.completed
  );

  // filter out assignments that are overdue
  // const currentDate = new Date();
  // const filteredAssignments2 = filteredAssignments.filter(
  //   (assignment) => new Date(assignment.dueDate) > currentDate
  // );

  // add any other filters here!!!!!

  // sends back _id, name, dueDate, completed, and reminders array
  return filteredAssignments;
};

//---------------------------------------------------

// Get events from Google Calendar API
const getEventsFromGoogle = async (req, res) => {
  const today = new Date(); // Get today's date
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${
      process.env.GOOGLE_CALENDAR_ID2
    }/events?timeMin=${today.toISOString()}&maxResults=30`,
    {
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    }
  );
  return response;
};

// returns events from our database refreshed from Google Calendar API
const getEvents = async (req, res) => {
  let timeZone = "";
  try {
    const response = await getEventsFromGoogle(req, res);
    if (response.status === 200) {
      const data = await response.json();
      timeZone = data.timeZone;
      const postProcessedData = await postProcess(
        data.items,
        req.user.googleId,
        timeZone
      );
      return res.json(postProcessedData);
    }
    if (response.status === 401) {
      refresh.requestNewAccessToken(
        "google",
        req.user.refreshToken,
        async function (err, accessToken, refreshToken) {
          let userForUpdate;
          if (refreshToken) {
            userForUpdate = {
              accessToken,
              refreshToken,
            };
          } else
            userForUpdate = {
              accessToken,
            };
          await User.findByIdAndUpdate(req.user._id, userForUpdate);
          const newResponse = await getEventsFromGoogle(req, res);
          if (newResponse.status === 200) {
            const data = await newResponse.json();
            timeZone = data.timeZone;
            const postProcessedData = await postProcess(
              data.items,
              req.user.googleId,
              timeZone
            );
            return res.json(postProcessedData);
          }
          return res.status(response.status).json(response.message);
        }
      );
    }
  } catch (error) {
    return res.status(400).json([]);
  }
  return res.status(400).json([]);
};

// Get a specific calendar by ID
const getCalendarById = async (req, res) => {
  const { id } = req.params;
  try {
    const calendar = await Calendar.findById(id);
    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }
    res.status(200).json(calendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEvents,
  getCalendarById,
};
