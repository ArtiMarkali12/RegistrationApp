const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");

// Create new course
router.post("/", courseController.createCourse);

// Get all courses
router.get("/", courseController.getCourses);

// Get single course by ID
router.get("/:id", courseController.getCourseById);

// Get course by name or ID
router.get("/search/:identifier", courseController.getCourseByNameOrId);

// Update course by ID
router.put("/:id", courseController.updateCourse);

// Delete course by ID
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
