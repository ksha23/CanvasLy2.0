import assignmnentListSaga from "./saga/assignmentListSaga";
import completeAssignmentSaga from "./saga/completeAssignmentSaga";
import updateAssignmentDifficultySaga from "./saga/updateAssignmentDifficultySaga";
import updateAssignmentTypeSaga from "./saga/updateAssignmentTypeSaga";
import addAssginmentReminderSaga from "./saga/addAssignmentReminderSaga";

import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
    assignmnentListSaga(),
    completeAssignmentSaga(),
    updateAssignmentDifficultySaga(),
    updateAssignmentTypeSaga(),
    addAssginmentReminderSaga(),
  ]);
}
