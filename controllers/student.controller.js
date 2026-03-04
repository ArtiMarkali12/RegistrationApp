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










// const Student = require("../models/student.model");
// const Enquiry = require("../models/enquiry.model");
// const studentService = require("../services/student.service");

// // ==========================
// // Create new student
// // ==========================
// exports.createStudent = async (req, res, next) => {
//   try {
//     const student = new Student(req.body);
//     await student.save();
//     res.status(201).json({
//       success: true,
//       data: student,
//       message: "Student registered successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // ==========================
// // Get all students
// // ==========================
// exports.getAllStudents = async (req, res, next) => {
//   try {
//     const students = await Student.find()
//       .populate("eid", "fname lname")    // Employee details
//       .populate("courseId", "name feesAmount duration"); // Course details

//     res.status(200).json({
//       success: true,
//       count: students.length,
//       data: students,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // ==========================
// // Get single student by stdId
// // ==========================
// exports.getStudentByStdId = async (req, res, next) => {
//   try {
//     const student = await Student.findOne({ stdId: req.params.stdId })
//       .populate("eid", "fname lname")
//       .populate("courseId", "name feesAmount duration");

//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }

//     res.status(200).json({ success: true, data: student });
//   } catch (error) {
//     next(error);
//   }
// };

// // ==========================
// // Update student by stdId
// // ==========================
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

//     res.status(200).json({
//       success: true,
//       data: student,
//       message: "Student updated successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // ==========================
// // Delete student by stdId
// // ==========================
// exports.deleteStudent = async (req, res, next) => {
//   try {
//     const student = await Student.findOneAndDelete({ stdId: req.params.stdId });

//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Student deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // ==========================
// // Get student + enquiry by contact number
// // ==========================
// exports.getStudentDetailsByContact = async (req, res, next) => {
//   try {
//     const contact = req.params.contact;

//     // Enquiry search
//     const enquiry = await Enquiry.findOne({ contact })
//       .populate("eid", "fname lname")       // Employee details
//       .populate({
//         path: "courseName",
//         populate: [
//           { path: "courseId", select: "name feesAmount duration requiredQualification" },
//           { path: "techId", select: "techName techId duration version" }
//         ]
//       });

//     // Student search
//     const student = await Student.findOne({ contact })
//       .populate("eid", "fname lname")
//       .populate("courseId", "name feesAmount duration requiredQualification");

//     if (!enquiry && !student) {
//       return res.status(404).json({
//         success: false,
//         message: "No enquiry or student registration found for this contact number",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         enquiry: enquiry || null,
//         student: student || null,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// /* ================= GET ALL STUDENTS ================= */
// exports.getAllStudents = async (req, res, next) => {
//   try {
//     const students = await studentService.getAllStudents();

//     res.status(200).json({
//       success: true,
//       count: students.length,
//       data: students,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* ================= GET STUDENT BY MONGODB _ID ================= */
// exports.getStudentById = async (req, res, next) => {
//   try {
//     const student = await studentService.getStudentById(req.params.id);

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// /* ================= GET STUDENT BY REGISTRATION NUMBER ================= */
// exports.getStudentByRegistrationNo = async (req, res, next) => {
//   try {
//     const student = await studentService.getStudentByRegistrationNo(
//       req.params.registration_no
//     );

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: "Student not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: student,
//     });
//   } catch (error) {
//     next(error);
//   }
// };







const Student = require("../models/student.model");
const Fees = require("../models/fees.model");
const sharp = require("sharp");
const studentService = require("../services/student.service");

/* ================= CREATE ================= */
exports.createStudent = async (req, res, next) => {
  try {
    const studentData = { ...req.body };

    // PHOTO
    if (req.files?.photo) {
      const compressedPhoto = await sharp(req.files.photo[0].buffer)
        .resize(300, 300)
        .jpeg({ quality: 70 })
        .toBuffer();

      studentData.photo =
        `data:image/jpeg;base64,` +
        compressedPhoto.toString("base64");
    }

    // SIGNATURE
    if (req.files?.signature) {
      const compressedSign = await sharp(req.files.signature[0].buffer)
        .resize(300, 150)
        .jpeg({ quality: 70 })
        .toBuffer();

      studentData.signature =
        `data:image/jpeg;base64,` +
        compressedSign.toString("base64");
    }

    const student = await Student.create(studentData);

    // 🎉 AUTO-CREATE FEES RECORD IF COURSE IS PROVIDED
    if (student.courseId) {
      try {
        const Course = require("../models/course.model");
        const course = await Course.findById(student.courseId);

        if (course) {
          const feesData = {
            studentId: student._id,
            employeeId: student.eid || 1,
            actualFees: course.feesAmount || 0,
            discount: 0,
            totalAmount: course.feesAmount || 0,
            totalPaid: 0,
            remainingAmount: course.feesAmount || 0,
            installmentNo: 0,
            feesStatus: "PENDING",
            statementDate: new Date(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            currentDate: new Date(),
            receiptNumber: `RCPT-INIT-${Date.now()}`,
            modeOfPayment: "CASH",
            transactionId: "INITIAL",
          };

          await Fees.create(feesData);
        }
      } catch (feeError) {
        console.error("⚠️ Auto fees creation failed:", feeError.message);
        // Don't fail student registration if fees creation fails
      }
    }

    res.status(201).json({
      success: true,
      data: student,
      message: "Student registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL ================= */
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET BY ID ================= */
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

/* ================= GET BY REGISTRATION ================= */
exports.getStudentByRegistrationNo = async (req, res, next) => {
  try {
    const student = await studentService.getStudentByRegistrationNo(
      req.params.registration_no
    );

    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

/* ================= GET BY NAME ================= */
exports.getStudentByName = async (req, res, next) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a student name to search",
      });
    }

    const students = await studentService.getStudentByName(name.trim());

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No students found with name "${name}"`,
      });
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET STUDENTS BY REGISTRATION NUMBER (LIST) ================= */
exports.getStudentRegistrationNumbers = async (req, res) => {
  try {
    const students = await Student.find()
      .select("registration_no fname mname lname contact email")
      .sort({ registration_no: 1 });

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students.map(student => ({
        registration_no: student.registration_no,
        fullName: `${student.fname} ${student.mname || ""} ${student.lname}`.trim(),
        contact: student.contact,
        email: student.email,
      })),
    });
  } catch (error) {
    console.error("Get Student Registration Numbers Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE ================= */
exports.updateStudent = async (req, res, next) => {
  try {
    const studentData = { ...req.body };

    if (req.files?.photo) {
      const compressedPhoto = await sharp(req.files.photo[0].buffer)
        .resize(300, 300)
        .jpeg({ quality: 70 })
        .toBuffer();

      studentData.photo =
        `data:image/jpeg;base64,` +
        compressedPhoto.toString("base64");
    }

    if (req.files?.signature) {
      const compressedSign = await sharp(req.files.signature[0].buffer)
        .resize(300, 150)
        .jpeg({ quality: 70 })
        .toBuffer();

      studentData.signature =
        `data:image/jpeg;base64,` +
        compressedSign.toString("base64");
    }

    const student = await Student.findOneAndUpdate(
      { registration_no: req.params.registration_no },
      studentData,
      { new: true, runValidators: true }
    );

    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.status(200).json({
      success: true,
      data: student,
      message: "Student updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndDelete({
      registration_no: req.params.registration_no,
    });

    if (!student)
      return res.status(404).json({ success: false, message: "Student not found" });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};