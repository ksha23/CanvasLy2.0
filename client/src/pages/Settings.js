import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Settings.css";
import Modal from "../components/SuccessPopup";
import { API_URL } from "../Endpoints";

const SettingsPage = () => {
  const getUserSimple = async () => {
    const response = await fetch(`${API_URL}/api/v1/users/userSimple`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setTheCalendarId(data.user.calendarId);
    setTheDifficultyWeight(data.user.difficultyWeight);
    setTheDueDateWeight(data.user.dueDateWeight);
    setTheTypeWeight(data.user.typeWeight);
  };

  const getCalendarData = async () => {
    const response = await fetch(`${API_URL}/api/v1/calendar/calendarData`, {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setCalendars(data);
  };

  const setCalendarId = async (calendarId) => {
    const response = await fetch(`${API_URL}/api/v1/users/setCalendarId`, {
      method: "put",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ calendarId }),
    });
    const data = await response.json();
    return data;
  };

  const setWeights = async (dueDateWeight, difficultyWeight, typeWeight) => {
    const response = await fetch(`${API_URL}/api/v1/users/weights`, {
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await getCalendarData();
      await getUserSimple();
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
      setError("ERROR: Weights must add up to 10");
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
      ) {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <p>
            <strong>Choose a calendar to display events from:</strong>
          </p>
          <select
            className="calendar-select"
            name="calendars"
            id="calendars"
            value={calendarId}
            onChange={(e) => setTheCalendarId(e.target.value)}
          >
            <option value="">Choose a Calendar</option>
            {calendars.map((calendar) => (
              <option key={calendar.id} value={calendar.id}>
                {calendar.summary}
              </option>
            ))}
          </select>

          <div className="input-container">
            <div>
              <label htmlFor="dueDateWeight">Weight for due date:</label>
              <input
                id="dueDateWeight"
                type="number"
                value={theDueDateWeight}
                onChange={(e) => setTheDueDateWeight(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="typeWeight">Weight for type:</label>
              <input
                id="typeWeight"
                type="number"
                value={theTypeWeight}
                onChange={(e) => setTheTypeWeight(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="difficultyWeight">Weight for difficulty:</label>
              <input
                id="difficultyWeight"
                type="number"
                value={theDifficultyWeight}
                onChange={(e) => setTheDifficultyWeight(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          <button className="settings-submit" type="submit">
            Save Settings
          </button>
        </form>
        <Modal show={showModal} message="Settings saved!" />
      </div>
    </div>
  );
};

export default SettingsPage;
