import { useEffect, useState } from "react";
import "./Assignments.css";
import EventComponent from "../components/Event";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { getAssignments } from "../redux/actions/assignmentListAction";
import { useDispatch } from "react-redux";
import Confetti from "react-confetti";

function AssignmentsPage() {
  // get calendar data from backend
  const getCalendarData = async () => {
    const response = await fetch(
      `http://localhost:4000/api/v1/calendar/calendarData`,
      {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return data;
  };

  const setCalendarId = async (calendarId) => {
    const response = await fetch(
      `http://localhost:4000/api/v1/users/setCalendarId`,
      {
        method: "put",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ calendarId }),
      }
    );
    const data = await response.json();
    window.location.reload(); // Refresh the page after updates
  };

  const [showConfetti, setShowConfetti] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const dispatch = useDispatch();
  let events = useSelector((state) => state.assignmentsListReducer);

  useEffect(() => {
    const fetchCalendarData = async () => {
      const data = await getCalendarData();
      setCalendars(data);
    };

    fetchCalendarData();
    dispatch(getAssignments());
    const interval = setInterval(() => {
      dispatch(getAssignments()); // automatically refresh data every minute
    }, 60000);

    return () => clearInterval(interval); // Cleanup function to clear interval on component unmount
  }, [dispatch]);

  const [updatedEvents, setUpdatedEvents] = useState([]);
  const [thecalendarId, setTheCalendarId] = useState("");

  // Update difficulty for an event by ID
  const onUpdateDifficultyAndType = (edited, id, difficulty, type) => {
    if (!edited) {
      // remove event from updatedEvents
      const updatedEventsCopy = [...updatedEvents];
      const existingIndex = updatedEventsCopy.findIndex(
        (event) => event.id === id
      );
      if (existingIndex !== -1) {
        updatedEventsCopy.splice(existingIndex, 1);
      }
      setUpdatedEvents(updatedEventsCopy);
      return;
    }
    const updatedEvent = { id, difficulty, type };
    const updatedEventsCopy = [...updatedEvents];
    const existingIndex = updatedEventsCopy.findIndex(
      (event) => event.id === id
    );
    if (existingIndex !== -1) {
      updatedEventsCopy[existingIndex] = updatedEvent;
    } else {
      updatedEventsCopy.push(updatedEvent);
    }
    setUpdatedEvents(updatedEventsCopy);
  };

  const completedAnEvent = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Change 3000 to the desired duration of the confetti
  };

  // Update all events with updated values
  const updateAllEvents = async () => {
    if (updatedEvents.length === 0) {
      return;
    }
    await Promise.all(
      updatedEvents.map(async (updatedEvent) => {
        const { id, difficulty, type } = updatedEvent;
        await updateAssignment(id, difficulty, type);
      })
    );
    window.location.reload(); // Refresh the page after updates
  };

  // Update an assignment by ID with new difficulty and type
  const updateAssignment = async (id, difficulty, type) => {
    const response = await fetch(
      `http://localhost:4000/api/v1/assignments/typeAndDifficulty/${id}`,
      {
        method: "put",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, difficulty }),
      }
    );
    const data = await response.json();
    return data;
  };

  return (
    <>
      <Navbar />
      {/* <p>{assignments.length}</p> */}
      <div className="assignments-container">
        {showConfetti && <Confetti />}

        <main>
          <section className="canvas-assignments">
            <h2>Canvas Assignments:</h2>
          </section>
          <div>
            <select
              className="calendar-select"
              onChange={(e) => setTheCalendarId(e.target.value)}
            >
              <option value="">Select a calendar</option>
              {calendars &&
                calendars.map((calendar) => (
                  <option key={calendar.id} value={calendar.id}>
                    {calendar.summary}
                  </option>
                ))}
            </select>
            <button
              className="calendar-id-submit-btn"
              onClick={() => setCalendarId(thecalendarId)}
            >
              Set Calendar
            </button>
          </div>
          <section className="canvas-assignments">
            {updatedEvents.length > 0 && (
              <button className="update-all-btn" onClick={updateAllEvents}>
                Update All
              </button>
            )}
            {updatedEvents.length > 0 && (
              <p>{updatedEvents.length} assignments edited</p>
            )}
          </section>
          <div className="events-list">
            {events &&
              events.length > 0 &&
              events.map((event) =>
                !event.completed ? (
                  <EventComponent
                    key={event._id}
                    id={event._id}
                    name={event.name}
                    dateTime={event.dueDate}
                    difficulty={event.difficulty}
                    type={event.type}
                    reminders={event.reminders}
                    onUpdateDifficultyAndType={onUpdateDifficultyAndType}
                    completedAnEvent={completedAnEvent}
                    className="event"
                  />
                ) : null
              )}
          </div>
        </main>
      </div>
    </>
  );
}

export default AssignmentsPage;
