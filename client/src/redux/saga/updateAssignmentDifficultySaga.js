import { takeEvery } from "redux-saga/effects";
import { UPDATE_ASSIGNMENT_DIFFICULTY } from "../constant";
import { API_URL } from "../../Endpoints";

// worker saga
function* updateAssignmentDifficultyWorker(action) {
  yield fetch(`${API_URL}/api/v1/assignments/difficulty/${action.id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: action.id, difficulty: action.difficulty }),
  });
}

function* updateAssignmentDifficulty() {
  yield takeEvery(
    UPDATE_ASSIGNMENT_DIFFICULTY,
    updateAssignmentDifficultyWorker
  );
}

export default updateAssignmentDifficulty;
