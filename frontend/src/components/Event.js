import React from "react";
import "./Event.css";
import { useState, useEffect } from "react";

const updateAssignment = async (id, difficulty, type) => {
  await changeAssignmentDifficulty(id, difficulty);
  await changeAssignmentType(id, type);
  window.location.reload();
};

const completeAssignment = async (id) => {
  const response = await fetch(
    `http://localhost:4000/api/v1/assignments/complete/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    }
  );
  const data = await response.json();
  window.location.reload();
  return data;
};

const changeAssignmentDifficulty = async (id, difficulty) => {
  const response = await fetch(
    `http://localhost:4000/api/v1/assignments/difficulty/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, difficulty: difficulty }),
    }
  );
  const data = await response.json();
  return data;
};

const changeAssignmentType = async (id, type) => {
  const response = await fetch(
    `http://localhost:4000/api/v1/assignments/type/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, type: type }),
    }
  );
  const data = await response.json();
  return data;
};

const EventComponent = ({ id, name, dateTime, difficulty, type }) => {
  const formattedDateTime = new Date(dateTime);

  const extractContentInBrackets = (str) => {
    const matches = str.match(/\[(.*?)\]/);
    return matches ? matches[1] : "";
  };

  const formatDate = (date) => {
    if (
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date)
    ) {
      return date.toDateString();
    } else {
      return "Invalid Date";
    }
  };

  const [theType, setType] = useState("");
  const [theDifficulty, setDifficulty] = useState("");

  useEffect(() => {
    setType(type);
    setDifficulty(difficulty);
  }, [type, difficulty]);

  const extractedContent = extractContentInBrackets(name);
  const displayName = extractedContent ? `${extractedContent} ` : "";

  return (
    <div className="event-container">
      <h3 className="event-title">
        {displayName}
        <span className="event-name">{name.replace(/\[.*?\]/, "")}</span>
      </h3>
      <p className="due-date">
        <strong>Due Date: </strong>
        {formatDate(formattedDateTime)} | <strong>Difficulty: </strong>
        {difficulty} | <strong>Type: </strong>
        {type}
      </p>
      <button onClick={() => completeAssignment(id)}>
        Complete Assignment
      </button>
      <select
        onChange={(e) => setDifficulty(e.target.value)}
        value={theDifficulty}
      >
        <option value="1">Difficulty 1</option>
        <option value="2">Difficulty 2</option>
        <option value="3">Difficulty 3</option>
        <option value="4">Difficulty 4</option>
        <option value="5">Difficulty 5</option>
      </select>
      <select onChange={(e) => setType(e.target.value)} value={theType}>
        <option value="Assignment">Assignment</option>
        <option value="Quiz">Quiz</option>
        <option value="Exam">Exam</option>
        <option value="Project">Project</option>
        <option value="Other">Other</option>
      </select>
      <button
        type="submit"
        onClick={() => updateAssignment(id, theDifficulty, theType)}
      >
        Update
      </button>
    </div>
  );
};

export default EventComponent;
