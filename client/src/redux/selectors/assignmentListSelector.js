import { createSelector } from "reselect";

// Existing logic for sorting
const customSort2 = (dueDateWeight, typeWeight, difficultyWeight) => (a, b) => {
  console.log("sorting with ", dueDateWeight, typeWeight, difficultyWeight);

  const typeValues = {
    Other: 1,
    Assignment: 2,
    Quiz: 3,
    Project: 4,
    Exam: 5,
  };

  const dateA = new Date(a.dueDate);
  const dateB = new Date(b.dueDate);

  const currentDate = new Date();

  const daysBetweenA = Math.abs((dateA - currentDate) / (1000 * 3600 * 24));
  const daysBetweenB = Math.abs((dateB - currentDate) / (1000 * 3600 * 24));

  // plug into function 1/1.2^x
  const normalizedDueDateValueA = 1 / Math.pow(1.2, daysBetweenA);
  const normalizedDueDateValueB = 1 / Math.pow(1.2, daysBetweenB);

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

// Selector function to sort assignments
export const getSortedAssignments = createSelector(
  (state) => state.assignmentsListReducer, // Replace with your actual state slice
  (_, dueDateWeight, typeWeight, difficultyWeight) =>
    customSort2(dueDateWeight, typeWeight, difficultyWeight),
  (assignments, customSortFunction) => [...assignments].sort(customSortFunction)
);
