import { useEffect, useState } from "react";
import "./Assignments.css";
import EventComponent from "../components/Event";
import PopupComponent from "../components/Popup";
import Navbar from "../components/Navbar";

// get the calendar events from the backend
async function getCalendarEvents() {
  const response = await fetch("http://localhost:4000/api/v1/calendar/events", {
    method: "get",
    credentials: "include",
  });
  const data = await response.json();
  return data;
}

function AssignmentsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const events = await getCalendarEvents();
      if (events.error) {
        return;
      }
      setEvents(events);
    }
    fetchData();
  }, []);

  const [updatedEvents, setUpdatedEvents] = useState([]);

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
      <div className="assignments-container">
        <main>
          <section className="canvas-assignments">
            <h2>Canvas Assignments:</h2>
            <PopupComponent />
          </section>
          <section className="canvas-assignments">
            {updatedEvents.length > 0 && (
              <button className="update-all-btn" onClick={updateAllEvents}>
                Update All
              </button>
            )}
            {/* <button onClick={() => setUpdatedEvents([])}>Cancel Changes</button> */}
            {updatedEvents.length > 0 && (
              <p>{updatedEvents.length} assignments edited</p>
            )}
          </section>
          <div className="events-list">
            {events &&
              events.length > 0 &&
              events.map((event) => (
                <EventComponent
                  key={event._id}
                  id={event._id}
                  name={event.name}
                  dateTime={event.dueDate}
                  difficulty={event.difficulty}
                  type={event.type}
                  onUpdateDifficultyAndType={onUpdateDifficultyAndType} // Pass update functions as props
                  className="event"
                />
              ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default AssignmentsPage;
