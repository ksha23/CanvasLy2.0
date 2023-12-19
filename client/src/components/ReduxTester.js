import { useDispatch } from "react-redux";
import "./ReduxTester.css";
import { completeAssignment } from "../redux/actions/action";
import { updateAssignmentType } from "../redux/actions/action";
import { updateAssignmentDifficulty } from "../redux/actions/action";
import { listAssignments } from "../redux/actions/assignmentListAction";
import { useSelector } from "react-redux";

function ReduxTester() {
  const dispatch = useDispatch();
  let data = useSelector((state) => state.assignmentsListReducer);
  console.warn("data in redux tester", data);
  const dummyData = {
    name: "dummyName",
    category: "dummyCategory",
    dueDate: "dummyDueDate",
    dueTime: "dummyDueTime",
    description: "dummyDescription",
  };

  return (
    <div className="redux-tester-container">
      <button onClick={() => dispatch(completeAssignment(dummyData))}>
        Complete Assignment
      </button>
      <button onClick={() => dispatch(updateAssignmentType(dummyData.name))}>
        Update Type
      </button>
      <button onClick={() => dispatch(updateAssignmentDifficulty())}>
        Update Difficulty
      </button>
      <button onClick={() => dispatch(listAssignments())}>
        List Assignments
      </button>
    </div>
  );
}
export default ReduxTester;
