import { LIST_ASSIGNMENTS, SET_ASSIGNMENTS_LIST } from "../constant";

export const assignmentsListReducer = (data = [], action) => {
  switch (action.type) {
    case SET_ASSIGNMENTS_LIST:
      console.warn("SET_ASSIGNMENTS_LIST reducer condition called", action);
      return [...action.data];
    default:
      return data;
  }
};
