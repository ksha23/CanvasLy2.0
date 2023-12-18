import { put, takeEvery } from "redux-saga/effects";
import { LIST_ASSIGNMENTS } from "../constant";

// worker saga
function* getAssignments() {
  let data = yield fetch("http://localhost:4000/api/v1/calendar/events", {
    method: "get",
    credentials: "include",
  });
  data = yield data.json();
  console.warn("getAssignments saga called ", data);
  yield put({ type: "SET_ASSIGNMENTS_LIST", data });
}

// watcher saga
function* assignmentsSaga() {
  yield takeEvery(LIST_ASSIGNMENTS, getAssignments);
}

export default assignmentsSaga;
