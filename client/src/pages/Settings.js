import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Settings.css";

const SettingsPage = () => {
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
    setCalendars(data);
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
    return data;
  };

  const getWeights = async () => {
    const response = await fetch(`http://localhost:4000/api/v1/users/weights`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  };

  const setWeights = async (dueDateWeight, difficultyWeight, typeWeight) => {
    const response = await fetch(`http://localhost:4000/api/v1/users/weights`, {
      method: "put",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dueDateWeight, difficultyWeight, typeWeight }),
    });
    const data = await response.json();
    return data;
  };

  const [calendars, setCalendars] = useState([]);
  const [theDueDateWeight, setTheDueDateWeight] = useState(0);
  const [theTypeWeight, setTheTypeWeight] = useState(0);
  const [theDifficultyWeight, setTheDifficultyWeight] = useState(0);
  const [error, setError] = useState("");
  const [calendarId, setTheCalendarId] = useState("");

  useEffect(() => {
    const setup = async () => {
      await getCalendarData();
      const response = await getWeights();
      if (response) {
        setTheDueDateWeight(response.dueDateWeight);
        setTheTypeWeight(response.typeWeight);
        setTheDifficultyWeight(response.difficultyWeight);
      }
    };
    setup();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dueDateWeight = parseInt(theDueDateWeight);
    const typeWeight = parseInt(theTypeWeight);
    const difficultyWeight = parseInt(theDifficultyWeight);

    const totalWeights = dueDateWeight + typeWeight + difficultyWeight;
    if (totalWeights !== 10) {
      setError("Weights should add up to 10");
    } else {
      setError("");
      // Process the weights, possibly send them to the server
      const response = await setWeights(
        dueDateWeight,
        difficultyWeight,
        typeWeight
      );

      // Process the calendar ID, possibly send it to the server
      const response2 = await setCalendarId(calendarId);
      if (
        response.message === "Weights updated" &&
        response2.message === "Calendar ID updated"
      )
        window.location.reload(); // Refresh the page after updates
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <p>Choose a calendar to display events from.</p>
          <select
            className="calendar-select"
            name="calendars"
            id="calendars"
            onChange={(e) => setTheCalendarId(e.target.value)}
          >
            <option>Choose a Calendar</option>
            {calendars.map((calendar) => (
              <option key={calendar.id} value={calendar.id}>
                {calendar.summary}
              </option>
            ))}
          </select>
          <p>Choose weight for due date:</p>
          <input
            type="number"
            value={theDueDateWeight}
            onChange={(e) => setTheDueDateWeight(e.target.value)}
          />

          <p>Choose weight for type:</p>
          <input
            type="number"
            value={theTypeWeight}
            onChange={(e) => setTheTypeWeight(e.target.value)}
          />

          <p>Choose weight for difficulty:</p>
          <input
            type="number"
            value={theDifficultyWeight}
            onChange={(e) => setTheDifficultyWeight(e.target.value)}
          />

          {error && <div style={{ color: "red" }}>{error}</div>}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
