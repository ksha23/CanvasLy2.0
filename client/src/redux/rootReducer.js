import { combineReducers } from "redux";
import { assignmentsReducer } from "./reducers/reducer";
import { assignmentsListReducer } from "./reducers/assignmentListReducer";

export default combineReducers({
  assignmentsReducer,
  assignmentsListReducer,
});
