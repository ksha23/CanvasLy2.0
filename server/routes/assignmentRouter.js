const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");

// Route to create a new assignment and associate it with a calendar
// router.post("/assignments", async (req, res) => {
//   assignmentController.createAssignments(req.params.calendarId);
// });

// Route to get all assignments
// router.get("/assignments", assignmentController.getAssignmentsByCalendarId);

// Route to update an assignment by its ID
router.put("/complete/:id", assignmentController.completeAssignmentById);
router.put("/difficulty/:id", assignmentController.changeDifficultyById);
router.put("/type/:id", assignmentController.changeTypeById);
router.put(
  "/typeAndDifficulty/:id",
  assignmentController.changeTypeAndDifficultyById
);
router.put("/reminder/:id", assignmentController.addReminderById);

module.exports = router;
