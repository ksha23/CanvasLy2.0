import { COMPLETE_ASSIGNMENT } from "../constant";
import { UPDATE_ASSIGNMENT_TYPE } from "../constant";
import { UPDATE_ASSIGNMENT_DIFFICULTY } from "../constant";

export const completeAssignment = (data) => {
  console.warn("completeAssignment action called ", data);
  return {
    type: COMPLETE_ASSIGNMENT,
    data,
  };
};

export const updateAssignmentType = (data) => {
  console.warn("updateAssignmentType action called ", data);
  return {
    type: UPDATE_ASSIGNMENT_TYPE,
    data,
  };
};

export const updateAssignmentDifficulty = () => {
  console.warn("updateAssignmentDifficulty action called ");
  return {
    type: UPDATE_ASSIGNMENT_DIFFICULTY,
  };
};
