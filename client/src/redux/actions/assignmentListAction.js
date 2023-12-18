import { LIST_ASSIGNMENTS } from "../constant";

export const listAssignments = () => {
  console.warn("listAssignments action called ");
  return {
    type: LIST_ASSIGNMENTS,
  };
};
