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
    window.location.reload(); // Refresh the page after updates
  };

  const getWeights = async () => {
    const response = await fetch(
      `http://localhost:4000/api/v1/users/getWeights`,
      {
        method: "get",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
  };

  const setDueDateWeight = async (dueDateWeight) => {
    const response = await fetch(
      `http://localhost:4000/api/v1/users/setDueDateWeight`,
      {
        method: "put",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dueDateWeight }),
      }
    );
    const data = await response.json();
    window.location.reload(); // Refresh the page after updates
  };

  const setTypeWeight = async (typeWeight) => {
    const response = await fetch(
      `http://localhost:4000/api/v1/users/setTypeWeight`,
      {
        method: "put",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ typeWeight }),
      }
    );
    const data = await response.json();
    window.location.reload(); // Refresh the page after updates
  };

  const setDifficultyWeight = async (difficultyWeight) => {
    const response = await fetch(
      `http://localhost:4000/api/v1/users/setDifficultyWeight`,
      {
        method: "put",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficultyWeight }),
      }
    );
    const data = await response.json();
    window.location.reload(); // Refresh the page after updates
  };

  const [calendars, setCalendars] = useState([]);
  const [dueDateWeight, setTheDueDateWeight] = useState(0);
  const [typeWeight, setTheTypeWeight] = useState(0);
  const [difficultyWeight, setTheDifficultyWeight] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    getCalendarData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalWeights = dueDateWeight + typeWeight + difficultyWeight;
    if (totalWeights !== 10) {
      setError("Weights should add up to 10.");
    } else {
      setError("");
      // Process the weights, possibly send them to the server
      console.log("Due Date Weight:", dueDateWeight);
      console.log("Type Weight:", typeWeight);
      console.log("Difficulty Weight:", difficultyWeight);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Settings</h2>
        <p>Choose a calendar to display events from.</p>
        <select
          className="calendar-select"
          name="calendars"
          id="calendars"
          onChange={console.log("hello")}
        >
          <option>Choose a Calendar</option>
          {calendars.map((calendar) => (
            <option value={calendar.id}>{calendar.summary}</option>
          ))}
        </select>
        <form onSubmit={handleSubmit}>
          <p>Choose weight for due date:</p>
          <input
            type="number"
            value={dueDateWeight}
            onChange={(e) => setDueDateWeight(parseInt(e.target.value) || 0)}
          />

          <p>Choose weight for type:</p>
          <input
            type="number"
            value={typeWeight}
            onChange={(e) => setTypeWeight(parseInt(e.target.value) || 0)}
          />

          <p>Choose weight for difficulty:</p>
          <input
            type="number"
            value={difficultyWeight}
            onChange={(e) => setDifficultyWeight(parseInt(e.target.value) || 0)}
          />

          {error && <div style={{ color: "red" }}>{error}</div>}
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
