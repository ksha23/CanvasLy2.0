import React from "react";
import "./Event.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { completeAssignment } from "../redux/actions/assignmentListAction";
import { updateAssignmentDifficulty } from "../redux/actions/assignmentListAction";
import { updateAssignmentType } from "../redux/actions/assignmentListAction";
import { useSelector } from "react-redux";
import { addAssignmentReminderAction } from "../redux/actions/assignmentListAction";

const EventComponent = ({
  id,
  name,
  dateTime,
  difficulty,
  type,
  reminders,
  onUpdateDifficultyAndType,
}) => {
  const dispatch = useDispatch();

  const changeAssignmentDifficulty = async (id, difficulty) => {
    dispatch(updateAssignmentDifficulty(id, difficulty));
    await handleEdited(id, difficulty, type);
  };

  const changeAssignmentType = async (id, type) => {
    dispatch(updateAssignmentType(id, type));
    await handleEdited(id, difficulty, type);
  };

  const addReminder = async (id, reminder) => {
    dispatch(addAssignmentReminderAction(id, reminder));
  };

  const complete = (id) => {
    dispatch(completeAssignment(id));
  };

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

  const handleUpdateButtonClick = async (id, difficulty, type) => {
    if (assignment.difficulty != difficulty && assignment.type != type) {
      await changeAssignmentDifficulty(id, difficulty);
      await changeAssignmentType(id, type);
    } else if (assignment.difficulty != difficulty) {
      await changeAssignmentDifficulty(id, difficulty);
    } else if (assignment.assignmentType != type) {
      await changeAssignmentType(id, type);
    }
  };

  const handleEdited = async (id, difficulty, type) => {
    if (assignment.type == type && assignment.difficulty == difficulty) {
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
    await setType(assignment.type);
    await setDifficulty(assignment.difficulty);
    onUpdateDifficultyAndType(
      false,
      id,
      assignment.difficulty,
      assignment.type
    );
  };

  const [theType, setType] = useState("");
  const [theDifficulty, setDifficulty] = useState("");
  const [edited, setEdited] = useState(false);
  const [reminder, setReminder] = useState("");

  useEffect(() => {
    setType(type);
    setDifficulty(difficulty);
  }, [difficulty, type]);

  let assignments = useSelector((state) => state.assignmentsListReducer);
  let assignment = assignments.find((assignment) => assignment._id === id);
  const extractedContent = extractContentInBrackets(name);
  const displayName = extractedContent ? `${extractedContent} ` : "";

  return (
    <div className={edited ? "edited-container" : "event-container"}>
      <div className="event-banner">
        {" "}
        <h3 className="event-title">
          {displayName}
          <span className="event-name">
            {": " + name.replace(/\[.*?\]/, "")}
          </span>
        </h3>
      </div>

      <div className="event-details">
        <p className="due-date">
          <strong>Due Date: </strong>
          {formatDate(formattedDateTime)} | <strong>Difficulty: </strong>
          {difficulty} | <strong>Type: </strong>
          {type}
        </p>
        <button
          className="complete-assignment-btn"
          onClick={() => complete(id)}
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
        <input
          className="add-reminder-input"
          type="text"
          placeholder="Reminder..."
          onChange={(e) => {
            setReminder(e.target.value);
          }}
        />
        <button
          className="add-reminder-btn"
          onClick={() => addReminder(id, reminder)}
        >
          Add Reminder
        </button>
        {edited && (
          <button
            type="submit"
            onClick={() => handleUpdateButtonClick(id, theDifficulty, theType)}
          >
            Update
          </button>
        )}
        {edited && (
          <button className="undo-changes-btn" onClick={() => undoAllChanges()}>
            Undo Changes
          </button>
        )}
        {reminders && reminders.length > 0 && (
          <p className="reminder-label">
            <strong>Reminders: </strong>
          </p>
        )}
        {reminders && (
          <ul>
            {reminders.map((reminder, index) => (
              <li key={index}>{reminder}</li>
            ))}
          </ul>
        )}{" "}
      </div>
    </div>
  );
};

export default EventComponent;
