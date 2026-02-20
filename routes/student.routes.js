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

// POST - create new student
router.post("/", studentController.createStudent);

// GET - get all students
router.get("/", studentController.getAllStudents);

// ✅ FIRST put specific route
router.get("/details/:contact", studentController.getStudentDetailsByContact);

// THEN generic route
router.get("/:stdId", studentController.getStudentByStdId);

// PUT - update student by stdId
router.put("/:stdId", studentController.updateStudent);

// DELETE - delete student by stdId
router.delete("/:stdId", studentController.deleteStudent);

module.exports = router;
