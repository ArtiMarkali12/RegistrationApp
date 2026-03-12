
const express = require("express");
const router = express.Router();
const multer = require("multer");
const studentController = require("../controllers/student.controller");

// Multer Memory Storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, jpeg, png files allowed"), false);
    }
  },
});

// CREATE
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  studentController.createStudent
);

// GET
router.get("/", studentController.getAllStudents);
router.get("/id/:id", studentController.getStudentById);
router.get("/registration/:registration_no", studentController.getStudentByRegistrationNo);
router.get("/search/name", studentController.getStudentByName);
router.get("/course/:courseName", studentController.getStudentsByCourseName);
router.get("/registration-numbers", studentController.getStudentRegistrationNumbers);
router.get("/enquiry/:enquiryNumber", studentController.getStudentByEnquiryNumber);

// UPDATE
router.put(
  "/registration/:registration_no",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  studentController.updateStudent
);

// DELETE
router.delete(
  "/registration/:registration_no",
  studentController.deleteStudent
);

module.exports = router;