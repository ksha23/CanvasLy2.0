const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");

// Route to update an assignment by its ID
router.put("/complete/:id", assignmentController.completeAssignmentById);

// Route to update an assignment difficulty by its ID
router.put("/difficulty/:id", assignmentController.changeDifficultyById);

// Route to update an assignment type by its ID
router.put("/type/:id", assignmentController.changeTypeById);

// Route to update an assignment difficulty and type by its ID
router.put(
  "/typeAndDifficulty/:id",
  assignmentController.changeTypeAndDifficultyById
);

// Route to add a reminder to an assignment by its ID
router.put("/reminder/:id", assignmentController.addReminderById);

module.exports = router;
