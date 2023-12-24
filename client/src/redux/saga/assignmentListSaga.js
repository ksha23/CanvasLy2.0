import { put, take, takeEvery } from "redux-saga/effects";
import { GET_ASSIGNMENTS } from "../constant";
import { API_URL } from "../../Endpoints";

// worker saga
function* getAssignmentsWorker() {
  let data = yield fetch(API_URL + "/api/v1/calendar/events", {
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
