import { put, take, takeEvery } from "redux-saga/effects";
import { GET_ASSIGNMENTS } from "../constant";

// worker saga
function* getAssignmentsWorker() {
  let data = yield fetch("http://localhost:4000/api/v1/calendar/events", {
    method: "get",
    credentials: "include",
  });
  data = yield data.json();
  yield put({ type: "SET_ASSIGNMENTS_LIST", data });
}

// watcher saga
function* assignmentListSaga() {
  yield takeEvery(GET_ASSIGNMENTS, getAssignmentsWorker);
}

// -----------------------------------------------------------

export default assignmentListSaga;
