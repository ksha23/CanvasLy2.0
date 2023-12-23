import {
  ADD_ASSIGNMENT_REMINDER,
  SET_ASSIGNMENTS_LIST,
  UPDATE_ASSIGNMENT_DIFFICULTY,
  UPDATE_ASSIGNMENT_TYPE,
} from "../constant";
import { COMPLETE_ASSIGNMENT } from "../constant";

const customSort2 = (a, b) => {
  const dueDateWeight = 0.5;
  const typeWeight = 0.2;
  const difficultyWeight = 0.3;

  const typeValues = {
    Other: 1,
    Assignment: 2,
    Quiz: 3,
    Project: 4,
    Exam: 5,
  };

  const dateA = new Date(a.dueDate);
  // dateA.setHours(dateA.getHours() + 6);

  const dateB = new Date(b.dueDate);
  // dateB.setHours(dateA.getHours() + 6);

  const currentDate = new Date();

  const daysBetweenA = Math.abs((dateA - currentDate) / (1000 * 3600 * 24));
  const daysBetweenB = Math.abs((dateB - currentDate) / (1000 * 3600 * 24));

  // plug into function 1/1.2^x
  const normalizedDueDateValueA = 1 / Math.pow(2, daysBetweenA);
  const normalizedDueDateValueB = 1 / Math.pow(2, daysBetweenB);

  const maxTypeValue = 5;
  const maxDifficultyValue = 5;

  const normalizedTypeValueA = typeValues[a.type] / maxTypeValue;
  const normalizedDifficultyValueA = a.difficulty / maxDifficultyValue;

  const normalizedTypeValueB = typeValues[b.type] / maxTypeValue;
  const normalizedDifficultyValueB = b.difficulty / maxDifficultyValue;

  const scoreA =
    dueDateWeight * normalizedDueDateValueA +
    typeWeight * normalizedTypeValueA +
    difficultyWeight * normalizedDifficultyValueA;

  const scoreB =
    dueDateWeight * normalizedDueDateValueB +
    typeWeight * normalizedTypeValueB +
    difficultyWeight * normalizedDifficultyValueB;

  if (scoreA < scoreB) {
    return 1;
  }
  if (scoreA > scoreB) {
    return -1;
  }
  return 0;
};

function customSort(a, b) {
  const dateWeight = 0.5;
  const typeWeight = 0.3;
  const difficultyWeight = 0.2;

  const currentDate = new Date();
  const dateA = new Date(a.dueDate);
  const dateB = new Date(b.dueDate);

  const typeValues = {
    Other: 1,
    Assignment: 2,
    Quiz: 3,
    Project: 4,
    Exam: 5,
  };

  const daysDifferenceA = Math.abs((dateA - currentDate) / (1000 * 3600 * 24));
  const daysDifferenceB = Math.abs((dateB - currentDate) / (1000 * 3600 * 24));

  // Exponential increase factor for time weight
  // function is 1 / (2^(0.5 * daysDifference) - 1)
  const exponentialFactorA = 1 / (Math.pow(2, 0.5 * daysDifferenceA) - 1);
  const exponentialFactorB = 1 / (Math.pow(2, 0.5 * daysDifferenceB) - 1);

  const maxTypeValue = 5;
  const maxDifficultyValue = 10;

  const normalizedTypeValueA = typeValues[a.type] / maxTypeValue;
  const normalizedDifficultyValueA = a.difficulty / maxDifficultyValue;
  const scoreA =
    dateWeight * exponentialFactorA +
    typeWeight * normalizedTypeValueA +
    difficultyWeight * normalizedDifficultyValueA;

  const normalizedTypeValueB = typeValues[b.type] / maxTypeValue;
  const normalizedDifficultyValueB = b.difficulty / maxDifficultyValue;
  const scoreB =
    dateWeight * exponentialFactorB +
    typeWeight * normalizedTypeValueB +
    difficultyWeight * normalizedDifficultyValueB;

  if (scoreA > scoreB) {
    return -1;
  } else if (scoreA < scoreB) {
    return 1;
  }
  return 0;
}

export const assignmentsListReducer = (data = [], action) => {
  switch (action.type) {
    case SET_ASSIGNMENTS_LIST:
      return [...action.data].sort(customSort2);
    case COMPLETE_ASSIGNMENT:
      const id = action.id;
      const index = data.findIndex((assignment) => assignment._id === id);
      data[index].completed = true;
      return [...data].sort(customSort2);
    case UPDATE_ASSIGNMENT_DIFFICULTY:
      const id2 = action.id;
      const index2 = data.findIndex((assignment) => assignment._id === id2);
      data[index2].difficulty = action.difficulty;
      return [...data].sort(customSort2);
    case UPDATE_ASSIGNMENT_TYPE:
      const id3 = action.id;
      const index3 = data.findIndex((assignment) => assignment._id === id3);
      data[index3].type = action.assignmentType;
      return [...data].sort(customSort2);
    case ADD_ASSIGNMENT_REMINDER:
      const id4 = action.id;
      const index4 = data.findIndex((assignment) => assignment._id === id4);
      data[index4].reminders.push(action.reminder);
      return [...data].sort(customSort2);
    default:
      return data;
  }
};
