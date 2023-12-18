import { COMPLETE_ASSIGNMENT } from "../constant";
import { UPDATE_ASSIGNMENT_TYPE } from "../constant";
import { UPDATE_ASSIGNMENT_DIFFICULTY } from "../constant";

export const assignmentsReducer = (data = [], action) => {
  switch (action.type) {
    case COMPLETE_ASSIGNMENT:
      console.warn("COMPLETE_ASSIGNMENT reducer condition called", action);
      return [...data, action.data];
    case UPDATE_ASSIGNMENT_TYPE:
      console.warn("UPDATE_ASSIGNMENT_TYPE reducer condition called", action);
      data.length = data.length ? data.length - 1 : [];
      return [...data];
    case UPDATE_ASSIGNMENT_DIFFICULTY:
      console.warn("UPDATE_ASSIGNMENT_DIFFICULTY reducer condition called");
      data = [];
      return [...data];
    default:
      return data;
  }
};
