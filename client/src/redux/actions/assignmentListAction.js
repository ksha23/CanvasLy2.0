import { GET_ASSIGNMENTS } from "../constant";
import { COMPLETE_ASSIGNMENT } from "../constant";
import { UPDATE_ASSIGNMENT_TYPE } from "../constant";
import { UPDATE_ASSIGNMENT_DIFFICULTY } from "../constant";
import { ADD_ASSIGNMENT_REMINDER } from "../constant";

export const getAssignments = () => {
  return {
    type: GET_ASSIGNMENTS,
  };
};

export const completeAssignment = (id) => {
  console.warn("completeAssignment action called ", id);
  return {
    type: COMPLETE_ASSIGNMENT,
    id,
  };
};

export const updateAssignmentType = (id, assignmentType) => {
  console.warn("updateAssignmentType action called ", id);
  return {
    type: UPDATE_ASSIGNMENT_TYPE,
    id,
    assignmentType,
  };
};

export const updateAssignmentDifficulty = (id, difficulty) => {
  console.warn("updateAssignmentDifficulty action called ", id);
  return {
    type: UPDATE_ASSIGNMENT_DIFFICULTY,
    id,
    difficulty,
  };
};

export const addAssignmentReminderAction = (id, reminder) => {
  console.warn("addAssginmentReminder action called ", id);
  console.warn("reminder: ", reminder);
  return {
    type: ADD_ASSIGNMENT_REMINDER,
    id,
    reminder,
  };
};
