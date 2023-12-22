import {
  ADD_ASSIGNMENT_REMINDER,
  SET_ASSIGNMENTS_LIST,
  UPDATE_ASSIGNMENT_DIFFICULTY,
  UPDATE_ASSIGNMENT_TYPE,
} from "../constant";
import { COMPLETE_ASSIGNMENT } from "../constant";

const customSort2 = (a, b) => {
  const typeValues = {
    Other: 1,
    Assignment: 2,
    Quiz: 3,
    Project: 4,
    Exam: 5,
  };

  const dateA = new Date(a.dueDate);
  const dateB = new Date(b.dueDate);

  const dateDiff = dateA - dateB; // Difference in due dates

  // Calculate weighted values for type and difficulty
  const weightedTypeA = typeValues[a.type] * 2; // Increase the weight for type
  const weightedTypeB = typeValues[b.type] * 2;
  const difficultyWeightA = a.difficulty / 2; // Decrease the weight for difficulty
  const difficultyWeightB = b.difficulty / 2;

  // Calculate weighted values for each task
  const weightedValueA = weightedTypeA + difficultyWeightA;
  const weightedValueB = weightedTypeB + difficultyWeightB;

  // Adjust the final sort comparison based on the weighted values
  if (weightedValueA > weightedValueB) {
    return -1; // A should come before B
  } else if (weightedValueA < weightedValueB) {
    return 1; // B should come before A
  } else {
    // If weighted values are equal, prioritize by due date
    return dateDiff;
  }
};

function customSort(a, b) {
  console.log("a", a);
  console.log("b", b);

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
      console.warn("COMPLETE_ASSIGNMENT reducer called");
      const id = action.id;
      const index = data.findIndex((assignment) => assignment._id === id);
      data[index].completed = true;
      return [...data].sort(customSort2);
    case UPDATE_ASSIGNMENT_DIFFICULTY:
      console.warn("UPDATE_ASSIGNMENT_DIFFICULTY reducer called");
      const id2 = action.id;
      const index2 = data.findIndex((assignment) => assignment._id === id2);
      data[index2].difficulty = action.difficulty;
      console.warn("new data: ", data);
      return [...data].sort(customSort2);
    case UPDATE_ASSIGNMENT_TYPE:
      console.warn("UPDATE_ASSIGNMENT_TYPE reducer called");
      const id3 = action.id;
      const index3 = data.findIndex((assignment) => assignment._id === id3);
      data[index3].type = action.assignmentType;
      console.warn("new data: ", data);
      return [...data].sort(customSort2);
    case ADD_ASSIGNMENT_REMINDER:
      console.warn("ADD_ASSIGNMENT_REMINDER reducer called");
      const id4 = action.id;
      const index4 = data.findIndex((assignment) => assignment._id === id4);
      data[index4].reminders.push(action.reminder);
      console.warn("new data: ", data);
      return [...data].sort(customSort2);
    default:
      return data;
  }
};
