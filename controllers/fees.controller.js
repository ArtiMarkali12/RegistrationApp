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
const Student = require("../models/student.model");
const { getNextReceiptNumber } = require("../services/receipt.service");

/* ================= CREATE FEES ================= */
exports.createFees = async (req, res) => {
  try {
    const feesData = { ...req.body };

    // Initialize totalPaid if not provided
    if (!feesData.totalPaid) {
      feesData.totalPaid = feesData.paidAmount || 0;
    }

    // Remove paidAmount from root as it's now in paymentHistory
    delete feesData.paidAmount;

    // Auto-generate receipt number if not provided
    if (!feesData.receiptNumber) {
      feesData.receiptNumber = await getNextReceiptNumber();
    }

    const fees = new Fees(feesData);
    await fees.save();

    res.status(201).json({
      success: true,
      message: "Fees record created successfully",
      data: fees,
    });
  } catch (error) {
    console.error("Create Fees Error:", error);
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
    console.error("Get All Fees Error:", error);
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
    console.error("Get Fees By Student Error:", error);
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
    console.error("Get Fees By ID Error:", error);
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
    console.error("Update Fees Error:", error);
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
    console.error("Delete Fees Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= GET PAYMENT MODES ================= */
exports.getPaymentModes = async (req, res) => {
  try {
    const paymentModes = Fees.schema.path("modeOfPayment").enumValues;

    res.status(200).json({
      success: true,
      data: paymentModes,
    });
  } catch (error) {
    console.error("Get Payment Modes Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= PAY FEE INSTALLMENT ================= */
exports.payFeeInstallment = async (req, res) => {
  try {
    const { installmentAmount, modeOfPayment, transactionId, employeeId } = req.body;

    // Validation
    if (!installmentAmount || installmentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid installment amount is required",
      });
    }

    if (!modeOfPayment) {
      return res.status(400).json({
        success: false,
        message: "Mode of payment is required",
      });
    }

    // Validate transaction ID for non-cash payments
    if (modeOfPayment !== "CASH" && (!transactionId || transactionId.length < 5)) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required for non-cash payments (min 5 characters)",
      });
    }

    // Find the fees record
    const fees = await Fees.findById(req.params.id).populate("studentId");

    if (!fees) {
      return res.status(404).json({
        success: false,
        message: "Fees record not found",
      });
    }

    // Check if fees already completed
    if (fees.feesStatus === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Fees already fully paid. No more installments accepted.",
      });
    }

    // Check if installment exceeds remaining amount
    if (installmentAmount > fees.remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `Installment amount exceeds remaining balance (₹${fees.remainingAmount})`,
      });
    }

    // Generate auto-increment receipt number
    const receiptNumber = await getNextReceiptNumber();

    // Calculate new installment number
    const newInstallmentNo = (fees.paymentHistory?.length || 0) + 1;

    // Add to payment history
    const paymentEntry = {
      installmentNo: newInstallmentNo,
      paidAmount: installmentAmount,
      modeOfPayment,
      transactionId: modeOfPayment === "CASH" ? "CASH" : transactionId,
      receiptNumber,
      employeeId: employeeId || 1,
    };

    // Update fees
    fees.totalPaid = (fees.totalPaid || 0) + installmentAmount;
    fees.modeOfPayment = modeOfPayment;
    fees.transactionId = modeOfPayment === "CASH" ? "CASH" : transactionId;
    fees.receiptNumber = receiptNumber;
    fees.installmentNo = newInstallmentNo;

    if (!fees.paymentHistory) {
      fees.paymentHistory = [];
    }
    fees.paymentHistory.push(paymentEntry);

    await fees.save();

    // Prepare response
    const response = {
      success: true,
      message: fees.feesStatus === "COMPLETED" 
        ? "🎉 Fees fully paid! Installment cleared." 
        : `Installment #${newInstallmentNo} of ₹${installmentAmount} paid successfully`,
      data: {
        feesId: fees._id,
        studentName: fees.studentId 
          ? `${fees.studentId.fname} ${fees.studentId.lname}` 
          : "N/A",
        registrationNo: fees.studentId?.registration_no || "N/A",
        totalAmount: fees.totalAmount,
        totalPaid: fees.totalPaid,
        remainingAmount: fees.remainingAmount,
        feesStatus: fees.feesStatus,
        currentInstallmentNo: fees.installmentNo,
        lastPayment: {
          installmentNo: newInstallmentNo,
          amount: installmentAmount,
          modeOfPayment,
          receiptNumber,
          paymentDate: paymentEntry.paymentDate,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Pay Installment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process installment payment",
    });
  }
};

/* ================= GET FEES SUMMARY BY STUDENT ================= */
exports.getFeesSummaryByStudent = async (req, res) => {
  try {
    const fees = await Fees.find({ studentId: req.params.studentId })
      .populate("studentId", "fname mname lname registration_no email contact")
      .sort({ createdAt: -1 });

    if (!fees || fees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No fees found for this student",
      });
    }

    // Calculate summary
    const summary = {
      totalFees: fees.reduce((sum, f) => sum + f.totalAmount, 0),
      totalPaid: fees.reduce((sum, f) => sum + f.totalPaid, 0),
      totalRemaining: fees.reduce((sum, f) => sum + f.remainingAmount, 0),
      totalInstallments: fees.reduce((sum, f) => sum + (f.paymentHistory?.length || 0), 0),
      status: fees[0].feesStatus,
    };

    res.json({
      success: true,
      data: {
        summary,
        details: fees,
      },
    });
  } catch (error) {
    console.error("Get Fees Summary Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL COMPLETED FEES ================= */
exports.getCompletedFees = async (req, res) => {
  try {
    const fees = await Fees.find({ feesStatus: "COMPLETED" })
      .populate("studentId", "fname mname lname registration_no email contact")
      .populate("employeeId", "fname lname")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: fees.length,
      data: fees,
    });
  } catch (error) {
    console.error("Get Completed Fees Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ALL PENDING/PARTIAL FEES ================= */
exports.getPendingFees = async (req, res) => {
  try {
    const fees = await Fees.find({ 
      feesStatus: { $in: ["PENDING", "PARTIAL"] } 
    })
      .populate("studentId", "fname mname lname registration_no email contact")
      .populate("employeeId", "fname lname")
      .sort({ remainingAmount: 1 });

    res.json({
      success: true,
      count: fees.length,
      data: fees,
    });
  } catch (error) {
    console.error("Get Pending Fees Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET FEES BY REGISTRATION NUMBER ================= */
exports.getFeesByRegistrationNo = async (req, res) => {
  try {
    const { registration_no } = req.params;

    // Find student by registration number
    const Student = require("../models/student.model");
    const student = await Student.findOne({ registration_no });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found with this registration number",
      });
    }

    // Find fees by student ID
    const fees = await Fees.find({ studentId: student._id })
      .populate("studentId", "fname mname lname registration_no email contact courseId")
      .populate("employeeId", "fname lname")
      .sort({ createdAt: -1 });

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

    // Calculate summary
    const summary = {
      totalFees: fees.reduce((sum, f) => sum + f.totalAmount, 0),
      totalPaid: fees.reduce((sum, f) => sum + f.totalPaid, 0),
      totalRemaining: fees.reduce((sum, f) => sum + f.remainingAmount, 0),
      totalInstallments: fees.reduce((sum, f) => sum + (f.paymentHistory?.length || 0), 0),
      status: fees[0].feesStatus,
    };

    res.json({
      success: true,
      data: {
        student: {
          _id: student._id,
          registration_no: student.registration_no,
          fname: student.fname,
          mname: student.mname,
          lname: student.lname,
          contact: student.contact,
          email: student.email,
        },
        summary,
        fees: fees,
      },
    });
  } catch (error) {
    console.error("Get Fees By Registration No Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= EDIT FEE INSTALLMENT DETAILS ================= */
exports.editFeeInstallment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      totalPaid,
      remainingAmount,
      installmentNo,
      statementDate,
      dueDate,
      modeOfPayment,
      transactionId,
      receiptNumber,
      discount,
      totalAmount,
    } = req.body;

    // Find the fees record
    const fees = await Fees.findById(id).populate("studentId");

    if (!fees) {
      return res.status(404).json({
        success: false,
        message: "Fees record not found",
      });
    }

    // Update fields if provided
    if (totalPaid !== undefined) {
      fees.totalPaid = totalPaid;
    }

    if (remainingAmount !== undefined) {
      fees.remainingAmount = remainingAmount;
    }

    if (installmentNo !== undefined) {
      fees.installmentNo = installmentNo;
    }

    if (statementDate !== undefined) {
      fees.statementDate = new Date(statementDate);
    }

    if (dueDate !== undefined) {
      fees.dueDate = new Date(dueDate);
    }

    if (modeOfPayment !== undefined) {
      fees.modeOfPayment = modeOfPayment;
    }

    if (transactionId !== undefined) {
      fees.transactionId = transactionId;
    }

    if (receiptNumber !== undefined) {
      fees.receiptNumber = receiptNumber;
    }

    if (discount !== undefined) {
      fees.discount = discount;
    }

    if (totalAmount !== undefined) {
      fees.totalAmount = totalAmount;
    }

    // Auto-update fees status based on remaining amount
    if (fees.remainingAmount <= 0 && fees.totalAmount > 0) {
      fees.feesStatus = "COMPLETED";
      fees.installmentNo = 0;
    } else if (fees.totalPaid > 0) {
      fees.feesStatus = "PARTIAL";
    } else {
      fees.feesStatus = "PENDING";
    }

    await fees.save();

    res.status(200).json({
      success: true,
      message: "Fee installment details updated successfully",
      data: {
        feesId: fees._id,
        studentName: fees.studentId 
          ? `${fees.studentId.fname} ${fees.studentId.lname}` 
          : "N/A",
        registrationNo: fees.studentId?.registration_no || "N/A",
        totalAmount: fees.totalAmount,
        totalPaid: fees.totalPaid,
        remainingAmount: fees.remainingAmount,
        feesStatus: fees.feesStatus,
        installmentNo: fees.installmentNo,
        statementDate: fees.statementDate,
        dueDate: fees.dueDate,
        modeOfPayment: fees.modeOfPayment,
        transactionId: fees.transactionId,
        receiptNumber: fees.receiptNumber,
      },
    });
  } catch (error) {
    console.error("Edit Fee Installment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADD MANUAL INSTALLMENT ENTRY ================= */
exports.addManualInstallment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      paidAmount,
      installmentNo,
      modeOfPayment,
      transactionId,
      receiptNumber,
      paymentDate,
      employeeId,
    } = req.body;

    // Validation
    if (!paidAmount || paidAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid paid amount is required",
      });
    }

    // Find the fees record
    const fees = await Fees.findById(id).populate("studentId");

    if (!fees) {
      return res.status(404).json({
        success: false,
        message: "Fees record not found",
      });
    }

    // Generate auto-increment receipt number if not provided
    const autoReceiptNumber = receiptNumber || await getNextReceiptNumber();

    // Create payment history entry
    const paymentEntry = {
      installmentNo: installmentNo || (fees.paymentHistory?.length || 0) + 1,
      paidAmount,
      modeOfPayment: modeOfPayment || "CASH",
      transactionId: modeOfPayment === "CASH" ? "CASH" : (transactionId || "MANUAL"),
      receiptNumber: autoReceiptNumber,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      employeeId: employeeId || 1,
    };

    // Add to payment history
    if (!fees.paymentHistory) {
      fees.paymentHistory = [];
    }
    fees.paymentHistory.push(paymentEntry);

    // Update total paid
    fees.totalPaid = (fees.totalPaid || 0) + paidAmount;

    // Update current installment number
    fees.installmentNo = paymentEntry.installmentNo;

    // Update mode of payment and transaction info
    fees.modeOfPayment = paymentEntry.modeOfPayment;
    fees.transactionId = paymentEntry.transactionId;
    fees.receiptNumber = paymentEntry.receiptNumber;

    await fees.save();

    res.status(200).json({
      success: true,
      message: "Manual installment entry added successfully",
      data: {
        feesId: fees._id,
        studentName: fees.studentId 
          ? `${fees.studentId.fname} ${fees.studentId.lname}` 
          : "N/A",
        registrationNo: fees.studentId?.registration_no || "N/A",
        totalAmount: fees.totalAmount,
        totalPaid: fees.totalPaid,
        remainingAmount: fees.remainingAmount,
        feesStatus: fees.feesStatus,
        installmentNo: fees.installmentNo,
        generatedReceiptNumber: autoReceiptNumber,
        newPaymentEntry: paymentEntry,
      },
    });
  } catch (error) {
    console.error("Add Manual Installment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET RECEIPT COUNTER ================= */
exports.getReceiptCounter = async (req, res) => {
  try {
    const { getCurrentReceiptCount } = require("../services/receipt.service");
    
    const currentCount = await getCurrentReceiptCount();
    
    const nextReceiptNumber = `RCPT-${String(currentCount + 1).padStart(6, '0')}`;
    
    res.status(200).json({
      success: true,
      data: {
        currentReceiptCount: currentCount,
        nextReceiptNumber: nextReceiptNumber,
        format: "RCPT-XXXXXX (6 digits)",
      },
    });
  } catch (error) {
    console.error("Get Receipt Counter Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
