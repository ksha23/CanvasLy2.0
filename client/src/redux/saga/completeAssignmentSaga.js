import { takeEvery } from "redux-saga/effects";
import { COMPLETE_ASSIGNMENT } from "../constant";
import { API_URL } from "../../Endpoints";

// worker saga
function* completeAssignment(action) {
  // make api call to update assignment
  const response = yield fetch(
    `${API_URL}/api/v1/assignments/complete/${action.id}`,
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

// watcher saga
function* assignmentSaga() {
  // take in data from the action and then make the api call
  yield takeEvery(COMPLETE_ASSIGNMENT, completeAssignment);
}

// -----------------------------------------------------------

export default assignmentSaga;
