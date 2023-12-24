import {
  ADD_ASSIGNMENT_REMINDER,
  SET_ASSIGNMENTS_LIST,
  UPDATE_ASSIGNMENT_DIFFICULTY,
  UPDATE_ASSIGNMENT_TYPE,
  RESET,
} from "../constant";
import { COMPLETE_ASSIGNMENT } from "../constant";

export const assignmentsListReducer = (data = [], action) => {
  switch (action.type) {
    case RESET:
      return [];
    case SET_ASSIGNMENTS_LIST:
      return [...action.data];
    case COMPLETE_ASSIGNMENT:
      const id = action.id;
      const index = data.findIndex((assignment) => assignment._id === id);
      data[index].completed = true;
      return [...data];
    case UPDATE_ASSIGNMENT_DIFFICULTY:
      const id2 = action.id;
      const index2 = data.findIndex((assignment) => assignment._id === id2);
      data[index2].difficulty = action.difficulty;
      return [...data];
    case UPDATE_ASSIGNMENT_TYPE:
      const id3 = action.id;
      const index3 = data.findIndex((assignment) => assignment._id === id3);
      data[index3].type = action.assignmentType;
      return [...data];
    case ADD_ASSIGNMENT_REMINDER:
      const id4 = action.id;
      const index4 = data.findIndex((assignment) => assignment._id === id4);
      data[index4].reminders.push(action.reminder);
      return [...data];
    default:
      return data;
  }
};

// import {
//   ADD_ASSIGNMENT_REMINDER,
//   SET_ASSIGNMENTS_LIST,
//   UPDATE_ASSIGNMENT_DIFFICULTY,
//   UPDATE_ASSIGNMENT_TYPE,
//   RESET,
// } from "../constant";
// import { COMPLETE_ASSIGNMENT } from "../constant";

// export const assignmentsListReducer = (data = [], action) => {
//   switch (action.type) {
//     case RESET:
//       return [];
//     case SET_ASSIGNMENTS_LIST:
//       return [...action.data];
//     case COMPLETE_ASSIGNMENT:
//       return data.map((assignment) =>
//         assignment._id === action.id
//           ? { ...assignment, completed: true }
//           : assignment
//       );
//     case UPDATE_ASSIGNMENT_DIFFICULTY:
//       return data.map((assignment) =>
//         assignment._id === action.id
//           ? { ...assignment, difficulty: action.difficulty }
//           : assignment
//       );
//     case UPDATE_ASSIGNMENT_TYPE:
//       return data.map((assignment) =>
//         assignment._id === action.id
//           ? { ...assignment, type: action.assignmentType }
//           : assignment
//       );
//     case ADD_ASSIGNMENT_REMINDER:
//       return data.map((assignment) =>
//         assignment._id === action.id
//           ? {
//               ...assignment,
//               reminders: [...assignment.reminders, action.reminder],
//             }
//           : assignment
//       );
//     default:
//       return data;
//   }
// };
