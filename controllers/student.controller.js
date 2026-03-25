const Student = require("../models/student.model");
const Fees = require("../models/fees.model");
const SuperAdmin = require("../models/superAdmin.model");
const sharp = require("sharp");
const studentService = require("../services/student.service");
const { sendRegistrationSuccessEmail } = require("../utils/email.service");

/* ================= CREATE ================= */
exports.createStudent = async (req, res, next) => {
  try {
    const studentData = { ...req.body };

    // 🔹 Auto-generate registration number if not provided
    if (!studentData.registration_no) {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      studentData.registration_no = `STU-${timestamp}-${random}`;
    }

    // Validate required fields
    const requiredFields = [
      "fname",
      "lname",
      "contact",
      "email",
      "eid",
      "courseId",
    ];
    const missingFields = requiredFields.filter((field) => !studentData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // 🔹 If superAdminId is provided, validate it exists
    if (studentData.superAdminId) {
      const superAdmin = await SuperAdmin.findById(studentData.superAdminId);
      if (!superAdmin) {
        return res.status(400).json({
          success: false,
          message: "Invalid superAdminId - SuperAdmin not found",
        });
      }
    }

    // PHOTO
    if (req.files?.photo) {
      try {
        const compressedPhoto = await sharp(req.files.photo[0].buffer)
          .resize(300, 300)
          .jpeg({ quality: 70 })
          .toBuffer();

        studentData.photo =
          `data:image/jpeg;base64,` + compressedPhoto.toString("base64");
      } catch (photoError) {
        console.error("Photo processing error:", photoError.message);
      }
    }

    // SIGNATURE
    if (req.files?.signature) {
      try {
        const compressedSign = await sharp(req.files.signature[0].buffer)
          .resize(300, 150)
          .jpeg({ quality: 70 })
          .toBuffer();

        studentData.signature =
          `data:image/jpeg;base64,` + compressedSign.toString("base64");
      } catch (signError) {
        console.error("Signature processing error:", signError.message);
      }
    }

    const student = await Student.create(studentData);

    // Verify the student was actually saved
    const savedStudent = await Student.findById(student._id);
    if (!savedStudent) {
      return res.status(500).json({
        success: false,
        message: "Student creation failed - data not saved",
      });
    }

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
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            currentDate: new Date(),
            receiptNumber: `RCPT-INIT-${Date.now()}`,
            modeOfPayment: "CASH",
            transactionId: "INITIAL",
          };

          await Fees.create(feesData);
        }
      } catch (feeError) {
        // Don't fail student registration if fees creation fails
      }
    }

    // ➕ Add student to SuperAdmin's students array
    if (studentData.superAdminId) {
      // If superAdminId is directly provided in request
      try {
        await SuperAdmin.findByIdAndUpdate(studentData.superAdminId, {
          $addToSet: { students: student._id },
        });
      } catch (superAdminError) {
        console.error(
          "Failed to add student to SuperAdmin:",
          superAdminError.message,
        );
      }
    } else if (student.eid) {
      // If superAdminId not provided, try to get it from employee
      try {
        const Employee = require("../models/employee.model");
        const employee = await Employee.findById(student.eid).populate(
          "superAdminId",
        );

        if (employee && employee.superAdminId) {
          await SuperAdmin.findByIdAndUpdate(employee.superAdminId._id, {
            $addToSet: { students: student._id },
          });
        }
      } catch (superAdminError) {
        // Don't fail student creation if superAdmin update fails
        console.error(
          "Failed to add student to SuperAdmin:",
          superAdminError.message,
        );
      }
    }

    // 📧 Send registration success email
    try {
      const fullName =
        `${student.fname} ${student.mname || ""} ${student.lname}`.trim();
      let courseName = "Not specified";

      if (student.courseId) {
        const Course = require("../models/course.model");
        const course = await Course.findById(student.courseId);
        if (course) {
          courseName = course.name;
        }
      }

      await sendRegistrationSuccessEmail(
        student.email,
        fullName,
        student.registration_no,
        courseName,
      );
    } catch (emailError) {
      // Don't fail registration if email fails - just log the error
      console.error("Failed to send registration email:", emailError.message);
    }

    // 💾 Save superAdminId to student record if provided
    if (studentData.superAdminId) {
      await Student.findByIdAndUpdate(student._id, {
        superAdminId: studentData.superAdminId,
      });
    }

    res.status(201).json({
      success: true,
      data: savedStudent,
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
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

/* ================= GET BY REGISTRATION ================= */
exports.getStudentByRegistrationNo = async (req, res, next) => {
  try {
    const student = await studentService.getStudentByRegistrationNo(
      req.params.registration_no,
    );

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

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

/* ================= GET STUDENTS BY COURSE NAME ================= */
exports.getStudentsByCourseName = async (req, res, next) => {
  try {
    const { courseName } = req.params;

    if (!courseName || courseName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a course name",
      });
    }

    // Find course by name (case-insensitive)
    const Course = require("../models/course.model");
    const course = await Course.findOne({ name: new RegExp(courseName, "i") });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course "${courseName}" not found`,
      });
    }

    // Find students by courseId
    const students = await Student.find({ courseId: course._id })
      .populate("eid", "fname lname")
      .populate("courseId", "name feesAmount duration");

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No students enrolled in "${course.name}"`,
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
      data: students.map((student) => ({
        registration_no: student.registration_no,
        fullName:
          `${student.fname} ${student.mname || ""} ${student.lname}`.trim(),
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
        `data:image/jpeg;base64,` + compressedPhoto.toString("base64");
    }

    if (req.files?.signature) {
      const compressedSign = await sharp(req.files.signature[0].buffer)
        .resize(300, 150)
        .jpeg({ quality: 70 })
        .toBuffer();

      studentData.signature =
        `data:image/jpeg;base64,` + compressedSign.toString("base64");
    }

    const student = await Student.findOneAndUpdate(
      { registration_no: req.params.registration_no },
      studentData,
      { new: true, runValidators: true },
    );

    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

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
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    // Remove student from SuperAdmin's students array (if linked)
    // Find SuperAdmins that have this student in their array and remove it
    await SuperAdmin.updateMany(
      { students: student._id },
      { $pull: { students: student._id } },
    );

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET STUDENT BY ENQUIRY NUMBER ================= */
exports.getStudentByEnquiryNumber = async (req, res, next) => {
  try {
    const { enquiryNumber } = req.params;

    // First try to find student by registration_no
    let student = await Student.findOne({
      registration_no: new RegExp(`^${enquiryNumber}$`, "i"),
    })
      .populate("eid", "fname lname email designation")
      .populate("courseId", "name feesAmount duration");

    // If not found, try to find by contact number (in case enquiry number is contact)
    if (!student) {
      student = await Student.findOne({
        contact: enquiryNumber,
      })
        .populate("eid", "fname lname email designation")
        .populate("courseId", "name feesAmount duration");
    }

    // If still not found, try to find enquiry first, then match student by contact
    if (!student) {
      const Enquiry = require("../models/enquiry.model");
      const enquiry = await Enquiry.findOne({
        enquiryNumber: new RegExp(`^${enquiryNumber}$`, "i"),
      });

      if (enquiry) {
        // Try to find student with same contact or email as enquiry
        student = await Student.findOne({
          $or: [{ contact: enquiry.contact }, { email: enquiry.email }],
        })
          .populate("eid", "fname lname email designation")
          .populate("courseId", "name feesAmount duration");
      }
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found for this enquiry number",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};
