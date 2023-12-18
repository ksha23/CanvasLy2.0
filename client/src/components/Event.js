import React from "react";
import "./Event.css";
import { useState, useEffect } from "react";

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

const EventComponent = ({
  id,
  name,
  dateTime,
  difficulty,
  type,
  onUpdateDifficultyAndType,
}) => {
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

  const updateAssignment = async (
    id,
    originalDifficulty,
    originalType,
    difficulty,
    type
  ) => {
    if (originalDifficulty != difficulty && originalType != type) {
      await changeAssignmentDifficulty(id, difficulty);
      await changeAssignmentType(id, type);
      window.location.reload();
    } else if (originalDifficulty != difficulty) {
      await changeAssignmentDifficulty(id, difficulty);
      window.location.reload();
    } else if (originalType != type) {
      await changeAssignmentType(id, type);
      window.location.reload();
    }
  };

  const handleEdited = async (id, difficulty, type) => {
    if (originalType == type && originalDifficulty == difficulty) {
      await setEdited(false);
      onUpdateDifficultyAndType(false, id, difficulty, type);
    } else {
      await setEdited(true);
      onUpdateDifficultyAndType(true, id, difficulty, type);
    }
    await setType(type);
    await setDifficulty(difficulty);
  };

  const undoAllChanges = async () => {
    await setEdited(false);
    await setType(originalType);
    await setDifficulty(originalDifficulty);
    onUpdateDifficultyAndType(false, id, originalDifficulty, originalType);
  };

  const [originalType, setOriginalType] = useState("");
  const [originalDifficulty, setOriginalDifficulty] = useState("");
  const [theType, setType] = useState("");
  const [theDifficulty, setDifficulty] = useState("");
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    setOriginalType(type);
    setOriginalDifficulty(difficulty);
    setType(type);
    setDifficulty(difficulty);
  }, [difficulty, type]);

  const extractedContent = extractContentInBrackets(name);
  const displayName = extractedContent ? `${extractedContent} ` : "";

  return (
    <div className={edited ? "edited-container" : "event-container"}>
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
      <button
        className="complete-assignment-btn"
        onClick={() => completeAssignment(id)}
      >
        Complete Assignment
      </button>
      <select
        onChange={(e) => {
          handleEdited(id, e.target.value, theType);
        }}
        value={theDifficulty}
      >
        <option value="1">Difficulty 1</option>
        <option value="2">Difficulty 2</option>
        <option value="3">Difficulty 3</option>
        <option value="4">Difficulty 4</option>
        <option value="5">Difficulty 5</option>
      </select>
      <select
        onChange={(e) => {
          handleEdited(id, theDifficulty, e.target.value);
        }}
        value={theType}
      >
        <option value="Assignment">Assignment</option>
        <option value="Quiz">Quiz</option>
        <option value="Exam">Exam</option>
        <option value="Project">Project</option>
        <option value="Other">Other</option>
      </select>
      {edited && (
        <button
          type="submit"
          onClick={() =>
            updateAssignment(
              id,
              originalDifficulty,
              originalType,
              theDifficulty,
              theType
            )
          }
        >
          Update
        </button>
      )}
      {edited && (
        <button className="undo-changes-btn" onClick={() => undoAllChanges()}>
          Undo Changes
        </button>
      )}
    </div>
  );
};

export default EventComponent;
