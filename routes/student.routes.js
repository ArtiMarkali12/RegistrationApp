// const express = require("express");
// const router = express.Router();
// const studentController = require("../controllers/student.controller");

// // POST - create new student
// router.post("/", studentController.createStudent);

// // GET - get all students
// router.get("/", studentController.getAllStudents);

// // GET - get single student by stdId
// router.get("/:stdId", studentController.getStudentByStdId);

// // PUT - update student by stdId
// router.put("/:stdId", studentController.updateStudent);

// // DELETE - delete student by stdId
// router.delete("/:stdId", studentController.deleteStudent);

// // GET student + enquiry by contact number
// router.get("/details/:contact", studentController.getStudentDetailsByContact);

// module.exports = router;






const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

// ==========================
// CREATE
// ==========================
router.post("/", studentController.createStudent);

// ==========================
// GET ALL
// ==========================
router.get("/", studentController.getAllStudents);

// ==========================
// SPECIAL ROUTES (ALWAYS FIRST)
// ==========================
router.get("/details/:contact", studentController.getStudentDetailsByContact);

// Get by registration number
router.get("/registration/:registration_no", studentController.getStudentByRegistrationNo);

// Get by MongoDB _id
router.get("/id/:id", studentController.getStudentById);

// ==========================
// UPDATE by registration number
// ==========================
router.put("/registration/:registration_no", studentController.updateStudent);

// ==========================
// DELETE by registration number
// ==========================
router.delete("/registration/:registration_no", studentController.deleteStudent);

module.exports = router;