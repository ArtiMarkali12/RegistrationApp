const express = require("express");
const router = express.Router();

const {
  createCourseTech,
  getCourseTechs,
  getCourseTechById,
  updateCourseTech,
  deleteCourseTech,
  getCourseWithTechs
} = require("../controllers/courseTech.controller");

// ------------------------
// CRUD routes
// ------------------------
router.post("/", createCourseTech);        // Create relation
router.get("/", getCourseTechs);          // Get all relations
router.get("/:id", getCourseTechById);    // Get relation by ID
router.put("/:id", updateCourseTech);     // Update relation
router.delete("/:id", deleteCourseTech);  // Delete relation

// ------------------------
// Get all technologies for a specific course
// ------------------------
router.get("/course/:courseId", getCourseWithTechs);

module.exports = router;
