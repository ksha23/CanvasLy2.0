const Assignment = require("../db/models/assignment");

// Complete an assignment by ID
const completeAssignmentById = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );
    if (!updatedAssignment) {
      console.error("Assignment not found");
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Change difficulty of an assignment by ID
const changeDifficultyById = async (req, res) => {
  const id = req.params.id;
  const { difficulty } = req.body;
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { difficulty },
      { new: true }
    );
    if (!updatedAssignment) {
      console.error("Assignment not found");
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Change type of an assignment by ID
const changeTypeById = async (req, res) => {
  const id = req.params.id;
  const type = req.body.type;

  // validate type
  const validTypes = ["Assignment", "Exam", "Quiz", "Project", "Other"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { type },
      { new: true }
    );
    if (!updatedAssignment) {
      console.error("Assignment not found");
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
};

// change type and difficulty of an assignment by ID
const changeTypeAndDifficultyById = async (req, res) => {
  const id = req.params.id;
  const { type, difficulty } = req.body;

  // validate type
  const validTypes = ["Assignment", "Exam", "Quiz", "Project", "Other"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { type, difficulty },
      { new: true }
    );
    if (!updatedAssignment) {
      console.error("Assignment not found");
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  completeAssignmentById,
  changeDifficultyById,
  changeTypeById,
  changeTypeAndDifficultyById,
};
