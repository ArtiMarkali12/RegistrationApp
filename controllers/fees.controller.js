// const Fees = require("../models/fees.model");

// /* ================= CREATE FEES ================= */
// exports.createFees = async (req, res) => {
//   try {
//     const fees = new Fees(req.body);
//     await fees.save();

//     res.status(201).json({
//       success: true,
//       message: "Fees record created successfully",
//       data: fees,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= GET ALL FEES ================= */
// exports.getAllFees = async (req, res) => {
//   try {
//     const fees = await Fees.find()
//       .populate("studentId", "name rollNo mobile email")
//       .populate("employeeId", "fname lname");

//     res.json({ success: true, data: fees });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ================= GET FEES BY STUDENT ================= */
// exports.getFeesByStudent = async (req, res) => {
//   try {
//     const fees = await Fees.find({ studentId: req.params.studentId })
//       .populate("studentId", "name rollNo mobile email")
//       .populate("employeeId", "fname lname");

//     if (!fees || fees.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No fees found for this student",
//       });
//     }

//     res.json({ success: true, data: fees });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ================= GET SINGLE FEES ================= */
// exports.getFeesById = async (req, res) => {
//   try {
//     const fees = await Fees.findById(req.params.id)
//       .populate("studentId", "name rollNo mobile email")
//       .populate("employeeId", "fname lname");

//     if (!fees)
//       return res.status(404).json({ message: "Fees record not found" });

//     res.json({ success: true, data: fees });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ================= UPDATE FEES ================= */
// exports.updateFees = async (req, res) => {
//   try {
//     const fees = await Fees.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!fees)
//       return res.status(404).json({ message: "Fees record not found" });

//     res.json({
//       success: true,
//       message: "Fees updated successfully",
//       data: fees,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// /* ================= DELETE FEES ================= */
// exports.deleteFees = async (req, res) => {
//   try {
//     const fees = await Fees.findByIdAndDelete(req.params.id);

//     if (!fees)
//       return res.status(404).json({ message: "Fees record not found" });

//     res.json({
//       success: true,
//       message: "Fees deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// // ================= GET FEES BY STUDENT =================
// exports.getFeesByStudent = async (req, res) => {
//   try {
//     const fees = await Fees.find({ studentId: req.params.studentId })
//       .populate("studentId", "name rollNo mobile email courseId") // all fields you want
//       .populate("employeeId", "fname lname");

//     if (!fees || fees.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No fees found for this student",
//       });
//     }

//     // Nested populate: course inside student
//     await Student.populate(fees, {
//       path: "studentId.courseId",
//       select: "name feesAmount duration requiredQualification",
//     });

//     res.json({ success: true, data: fees });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };















const Fees = require("../models/fees.model");
const Student = require("../models/student.model"); // 🔹 For nested populate

/* ================= CREATE FEES ================= */
exports.createFees = async (req, res) => {
  try {
    const fees = new Fees(req.body);
    await fees.save();

    res.status(201).json({
      success: true,
      message: "Fees record created successfully",
      data: fees,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL FEES ================= */
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fees.find()
      .populate("studentId", "fname mname lname registration_no email contact courseId")
      .populate("employeeId", "fname lname");

    // Nested populate for course info
    await Student.populate(fees, {
      path: "studentId.courseId",
      select: "name feesAmount duration requiredQualification",
    });

    res.json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET FEES BY STUDENT ================= */
exports.getFeesByStudent = async (req, res) => {
  try {
    const fees = await Fees.find({ studentId: req.params.studentId })
      .populate("studentId", "fname mname lname registration_no email contact courseId")
      .populate("employeeId", "fname lname");

    if (!fees || fees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No fees found for this student",
      });
    }

    // Nested populate for course info
    await Student.populate(fees, {
      path: "studentId.courseId",
      select: "name feesAmount duration requiredQualification",
    });

    res.json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET SINGLE FEES ================= */
exports.getFeesById = async (req, res) => {
  try {
    const fees = await Fees.findById(req.params.id)
      .populate("studentId", "fname mname lname registration_no email contact courseId")
      .populate("employeeId", "fname lname");

    if (!fees)
      return res.status(404).json({ success: false, message: "Fees record not found" });

    // Nested populate for course info
    await Student.populate(fees, {
      path: "studentId.courseId",
      select: "name feesAmount duration requiredQualification",
    });

    res.json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE FEES ================= */
exports.updateFees = async (req, res) => {
  try {
    const fees = await Fees.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!fees)
      return res.status(404).json({ success: false, message: "Fees record not found" });

    res.json({
      success: true,
      message: "Fees updated successfully",
      data: fees,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* ================= DELETE FEES ================= */
exports.deleteFees = async (req, res) => {
  try {
    const fees = await Fees.findByIdAndDelete(req.params.id);

    if (!fees)
      return res.status(404).json({ success: false, message: "Fees record not found" });

    res.json({
      success: true,
      message: "Fees deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
