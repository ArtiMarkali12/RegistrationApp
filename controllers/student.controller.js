// const Student = require("../models/student.model");

// // Create new student
// exports.createStudent = async (req, res, next) => {
//   try {
//     const student = new Student(req.body);
//     await student.save();
//     res.status(201).json({
//       success: true,
//       data: student,
//       message: "Student registered successfully"
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get all students
// exports.getAllStudents = async (req, res, next) => {
//   try {
//     const students = await Student.find()
//       .populate("eid", "fname lname")    // populate employee name fields
//       .populate("courseId", "courseName"); // populate course name
//     res.status(200).json({
//       success: true,
//       count: students.length,
//       data: students
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get single student by stdId
// exports.getStudentByStdId = async (req, res, next) => {
//   try {
//     const student = await Student.findOne({ stdId: req.params.stdId })
//       .populate("eid", "fname lname")
//       .populate("courseId", "courseName");
//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }
//     res.status(200).json({ success: true, data: student });
//   } catch (error) {
//     next(error);
//   }
// };

// // Update student by stdId
// exports.updateStudent = async (req, res, next) => {
//   try {
//     const student = await Student.findOneAndUpdate(
//       { stdId: req.params.stdId },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }
//     res.status(200).json({ success: true, data: student, message: "Student updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// // Delete student by stdId
// exports.deleteStudent = async (req, res, next) => {
//   try {
//     const student = await Student.findOneAndDelete({ stdId: req.params.stdId });
//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }
//     res.status(200).json({ success: true, message: "Student deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };










const Student = require("../models/student.model");
const Enquiry = require("../models/enquiry.model");

// ==========================
// Create new student
// ==========================
exports.createStudent = async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({
      success: true,
      data: student,
      message: "Student registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Get all students
// ==========================
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate("eid", "fname lname")    // Employee details
      .populate("courseId", "name feesAmount duration"); // Course details

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Get single student by stdId
// ==========================
exports.getStudentByStdId = async (req, res, next) => {
  try {
    const student = await Student.findOne({ stdId: req.params.stdId })
      .populate("eid", "fname lname")
      .populate("courseId", "name feesAmount duration");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Update student by stdId
// ==========================
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { stdId: req.params.stdId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      data: student,
      message: "Student updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Delete student by stdId
// ==========================
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndDelete({ stdId: req.params.stdId });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Get student + enquiry by contact number
// ==========================
exports.getStudentDetailsByContact = async (req, res, next) => {
  try {
    const contact = req.params.contact;

    // Enquiry search
    const enquiry = await Enquiry.findOne({ contact })
      .populate("eid", "fname lname")       // Employee details
      .populate({
        path: "courseName",
        populate: [
          { path: "courseId", select: "name feesAmount duration requiredQualification" },
          { path: "techId", select: "techName techId duration version" }
        ]
      });

    // Student search
    const student = await Student.findOne({ contact })
      .populate("eid", "fname lname")
      .populate("courseId", "name feesAmount duration requiredQualification");

    if (!enquiry && !student) {
      return res.status(404).json({
        success: false,
        message: "No enquiry or student registration found for this contact number",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        enquiry: enquiry || null,
        student: student || null,
      },
    });
  } catch (error) {
    next(error);
  }
};
