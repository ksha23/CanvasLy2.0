import { combineReducers } from "redux";
import { assignmentsReducer } from "./reducer";
import { assignmentsListReducer } from "./assignmentListReducer";

export default combineReducers({
  assignmentsReducer,
  assignmentsListReducer,
});
