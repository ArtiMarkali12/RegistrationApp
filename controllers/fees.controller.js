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

    // Auto-generate unique receipt number if not provided
    if (!feesData.receiptNumber) {
      let receiptNumber;
      let retryCount = 0;

      do {
        receiptNumber = await getNextReceiptNumber();
        const existingReceipt = await Fees.findOne({ receiptNumber });
        if (existingReceipt && retryCount < 10) {
          console.log(
            `Receipt ${receiptNumber} already exists, generating new one...`,
          );
          retryCount++;
        } else {
          break;
        }
      } while (retryCount < 10);

      feesData.receiptNumber = receiptNumber;
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
      .populate(
        "studentId",
        "fname mname lname registration_no email contact courseId",
      )
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
      .populate(
        "studentId",
        "fname mname lname registration_no email contact courseId",
      )
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
      .populate(
        "studentId",
        "fname mname lname registration_no email contact courseId",
      )
      .populate("employeeId", "fname lname");

    if (!fees)
      return res
        .status(404)
        .json({ success: false, message: "Fees record not found" });

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
      return res
        .status(404)
        .json({ success: false, message: "Fees record not found" });

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
      return res
        .status(404)
        .json({ success: false, message: "Fees record not found" });

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
    const {
      installmentAmount,
      modeOfPayment,
      transactionId,
      employeeId,
      nextInstallmentDate,
    } = req.body;

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
    if (
      modeOfPayment !== "CASH" &&
      (!transactionId || transactionId.length < 5)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Transaction ID is required for non-cash payments (min 5 characters)",
      });
    }

    // Find the fees record and populate student
    const fees = await Fees.findById(req.params.id).populate({
      path: "studentId",
      populate: { path: "courseId", model: "Course" },
    });

    if (!fees) {
      return res.status(404).json({
        success: false,
        message: "Fees record not found",
      });
    }

    // Extract student info with fallbacks
    let studentName = "N/A";
    let registrationNo = "N/A";
    let studentEmail = "N/A";
    let studentContact = "N/A";
    let studentCourse = "N/A";

    if (fees.studentId) {
      const student = fees.studentId;
      studentName =
        `${student.fname || ""} ${student.mname || ""} ${student.lname || ""}`.trim() ||
        "N/A";
      registrationNo = student.registration_no || "N/A";
      studentEmail = student.email || "N/A";
      studentContact = student.contact || "N/A";

      // Get course info
      if (student.courseId && student.courseId.name) {
        studentCourse = student.courseId.name;
      }

      console.log("✓ Student found:", studentName, registrationNo);
    } else {
      console.log("⚠ No studentId in fees record:", fees._id);
      console.log("Fees data:", JSON.stringify(fees.toObject(), null, 2));
    }

    // Auto-fix missing totalAmount (use actualFees or calculate from paymentHistory)
    if (!fees.totalAmount || fees.totalAmount <= 0) {
      fees.totalAmount =
        fees.actualFees || (fees.totalPaid || 0) + fees.remainingAmount;
      if (!fees.actualFees) {
        fees.actualFees = fees.totalAmount;
      }
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

    // Generate unique receipt number (with retry logic)
    let receiptNumber;
    let retryCount = 0;

    do {
      receiptNumber = await getNextReceiptNumber();
      const existingReceipt = await Fees.findOne({ receiptNumber });
      if (existingReceipt && retryCount < 10) {
        console.log(
          `Receipt ${receiptNumber} already exists, generating new one...`,
        );
        retryCount++;
      } else {
        break;
      }
    } while (retryCount < 10);

    // Add to payment history
    const paymentEntry = {
      paidAmount: installmentAmount,
      modeOfPayment,
      transactionId: modeOfPayment === "CASH" ? "CASH" : transactionId,
      receiptNumber,
      employeeId: employeeId || null,
      nextInstallmentDate: nextInstallmentDate
        ? new Date(nextInstallmentDate)
        : null,
    };

    // Update fees
    fees.totalPaid = (fees.totalPaid || 0) + installmentAmount;
    fees.modeOfPayment = modeOfPayment;
    fees.transactionId = modeOfPayment === "CASH" ? "CASH" : transactionId;
    fees.receiptNumber = receiptNumber;

    // Set next installment date
    if (nextInstallmentDate) {
      fees.nextInstallmentDate = new Date(nextInstallmentDate);
    }

    if (!fees.paymentHistory) {
      fees.paymentHistory = [];
    }
    fees.paymentHistory.push(paymentEntry);

    await fees.save();

    // Prepare response with full fees details
    const response = {
      success: true,
      message:
        fees.feesStatus === "COMPLETED"
          ? "🎉 Fees fully paid! Installment cleared."
          : `Installment of ₹${installmentAmount} paid successfully`,
      data: {
        feesId: fees._id,
        studentName: studentName,
        registrationNo: registrationNo,
        studentEmail: studentEmail,
        studentContact: studentContact,
        studentCourse: studentCourse,
        feesDetails: {
          totalAmount: fees.totalAmount,
          actualFees: fees.actualFees,
          ...(fees.discount > 0 ? { discount: fees.discount } : {}),
          totalPaid: fees.totalPaid,
          remainingAmount: fees.remainingAmount,
          feesStatus: fees.feesStatus,
          statementDate: fees.statementDate,
          dueDate: fees.dueDate,
          nextInstallmentDate: fees.nextInstallmentDate,
          modeOfPayment: fees.modeOfPayment,
          transactionId: fees.transactionId,
          receiptNumber: fees.receiptNumber,
        },
        paymentHistory: fees.paymentHistory.map((entry) => ({
          paidAmount: entry.paidAmount,
          modeOfPayment: entry.modeOfPayment,
          transactionId: entry.transactionId,
          receiptNumber: entry.receiptNumber,
          paymentDate: entry.paymentDate,
          nextInstallmentDate: entry.nextInstallmentDate,
        })),
        lastPayment: {
          amount: installmentAmount,
          modeOfPayment,
          receiptNumber,
          paymentDate: paymentEntry.paymentDate,
          nextInstallmentDate: paymentEntry.nextInstallmentDate,
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
      totalInstallments: fees.reduce(
        (sum, f) => sum + (f.paymentHistory?.length || 0),
        0,
      ),
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
      feesStatus: { $in: ["PENDING", "PARTIAL"] },
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
      .populate(
        "studentId",
        "fname mname lname registration_no email contact courseId",
      )
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
      totalInstallments: fees.reduce(
        (sum, f) => sum + (f.paymentHistory?.length || 0),
        0,
      ),
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
      statementDate,
      dueDate,
      nextInstallmentDate,
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

    if (statementDate !== undefined) {
      fees.statementDate = new Date(statementDate);
    }

    if (dueDate !== undefined) {
      fees.dueDate = new Date(dueDate);
    }

    if (nextInstallmentDate !== undefined) {
      fees.nextInstallmentDate = new Date(nextInstallmentDate);
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
        statementDate: fees.statementDate,
        dueDate: fees.dueDate,
        nextInstallmentDate: fees.nextInstallmentDate,
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
      modeOfPayment,
      transactionId,
      receiptNumber,
      paymentDate,
      employeeId,
      nextInstallmentDate,
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
    const autoReceiptNumber = receiptNumber || (await getNextReceiptNumber());

    // Create payment history entry
    const paymentEntry = {
      paidAmount,
      modeOfPayment: modeOfPayment || "CASH",
      transactionId:
        modeOfPayment === "CASH" ? "CASH" : transactionId || "MANUAL",
      receiptNumber: autoReceiptNumber,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      employeeId: employeeId || null,
      nextInstallmentDate: nextInstallmentDate
        ? new Date(nextInstallmentDate)
        : null,
    };

    // Add to payment history
    if (!fees.paymentHistory) {
      fees.paymentHistory = [];
    }
    fees.paymentHistory.push(paymentEntry);

    // Update total paid
    fees.totalPaid = (fees.totalPaid || 0) + paidAmount;

    // Set next installment date
    if (nextInstallmentDate) {
      fees.nextInstallmentDate = new Date(nextInstallmentDate);
    }

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
        nextInstallmentDate: fees.nextInstallmentDate,
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

    const nextReceiptNumber = `RCPT-${String(currentCount + 1).padStart(6, "0")}`;

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

/* ================= GENERATE RECEIPT PDF (DOWNLOADABLE) ================= */
exports.generateReceiptPDF = async (req, res) => {
  try {
    const { studentDocId, modeOfPayment, transactionId, nextDueDate } =
      req.body;

    if (!studentDocId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const { generateReceiptPDF } = require("../services/receiptService");

    const { pdfBuffer, receiptNumber } = await generateReceiptPDF({
      studentDocId,
      modeOfPayment: modeOfPayment || "CASH",
      transactionId: transactionId || "N/A",
      nextDueDate: nextDueDate || "N/A",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="Fee_Receipt_${receiptNumber}.pdf"`,
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Generate Receipt PDF Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= SEND RECEIPT EMAIL ================= */
exports.sendReceiptEmail = async (req, res) => {
  try {
    const { studentDocId, modeOfPayment, transactionId, nextDueDate } =
      req.body;

    if (!studentDocId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const { sendReceiptEmail } = require("../services/receiptService");

    await sendReceiptEmail({
      studentDocId,
      modeOfPayment,
      transactionId,
      nextDueDate,
    });

    res.status(200).json({
      success: true,
      message: "Receipt generated and sent to student email successfully",
    });
  } catch (error) {
    console.error("Send Receipt Email Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= SEND RECEIPT (LEGACY SUPPORT) ================= */
exports.sendReceipt = async (req, res) => {
  try {
    const { studentDocId, modeOfPayment, transactionId, nextDueDate } =
      req.body;

    if (!studentDocId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const { sendReceiptEmail } = require("../services/receiptService");

    await sendReceiptEmail({
      studentDocId,
      modeOfPayment,
      transactionId,
      nextDueDate,
    });

    res.status(200).json({
      success: true,
      message: "Receipt generated and sent to student email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
