const Fees = require("../models/fees.model");
const Student = require("../models/student.model");
const Employee = require("../models/employee.model");

/**
 * Get notifications for logged-in employee about upcoming fee due dates
 * @param {string} employeeId - The logged-in employee's MongoDB ID
 * @param {number} daysThreshold - Number of days before due date to notify (default: 7)
 */
exports.getFeeDueNotifications = async (employeeId, daysThreshold = 7) => {
  try {
    // Find employee to get their employeeId number
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return { success: false, message: "Employee not found" };
    }

    const employeeIdNum = employee.employeeId;

    // Calculate date threshold
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    // Find fees with due dates approaching and assigned to this employee
    const upcomingFees = await Fees.find({
      employeeId: employeeIdNum,
      dueDate: {
        $gte: today,
        $lte: thresholdDate
      },
      feesStatus: { $in: ["PENDING", "PARTIAL"] }
    })
    .populate("studentId", "fname lname email contact")
    .sort({ dueDate: 1 });

    // Format notifications
    const notifications = upcomingFees.map(fee => {
      const daysRemaining = Math.ceil((fee.dueDate - today) / (1000 * 60 * 60 * 24));
      const student = fee.studentId;
      
      let urgencyLevel = "normal";
      if (daysRemaining <= 2) {
        urgencyLevel = "high";
      } else if (daysRemaining <= 5) {
        urgencyLevel = "medium";
      }

      return {
        _id: fee._id,
        type: "FEE_DUE",
        title: `Fee Installment Due - ${student?.fname || "Student"}`,
        message: `Fee installment #${fee.installmentNo} for ${student?.fname || "Student"} ${student?.lname || ""} is due in ${daysRemaining} day(s)`,
        studentName: `${student?.fname || ""} ${student?.lname || ""}`.trim(),
        studentEmail: student?.email,
        studentContact: student?.contact,
        installmentNo: fee.installmentNo,
        dueAmount: fee.remainingAmount,
        dueDate: fee.dueDate,
        daysRemaining: daysRemaining,
        urgencyLevel: urgencyLevel,
        createdAt: fee.createdAt
      };
    });

    return {
      success: true,
      count: notifications.length,
      data: notifications
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get all notifications including overdue fees
 */
exports.getAllFeeNotifications = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return { success: false, message: "Employee not found" };
    }

    const employeeIdNum = employee.employeeId;
    const today = new Date();

    // Find all pending/partial fees for this employee
    const allFees = await Fees.find({
      employeeId: employeeIdNum,
      feesStatus: { $in: ["PENDING", "PARTIAL"] }
    })
    .populate("studentId", "fname lname email contact")
    .sort({ dueDate: 1 });

    const notifications = allFees.map(fee => {
      const daysRemaining = Math.ceil((fee.dueDate - today) / (1000 * 60 * 60 * 24));
      const student = fee.studentId;
      
      let status = "upcoming";
      let urgencyLevel = "normal";
      
      if (daysRemaining < 0) {
        status = "overdue";
        urgencyLevel = "critical";
      } else if (daysRemaining <= 2) {
        urgencyLevel = "high";
      } else if (daysRemaining <= 5) {
        urgencyLevel = "medium";
      }

      return {
        _id: fee._id,
        type: "FEE_DUE",
        title: `${status === "overdue" ? "OVERDUE" : "Fee Due"} - ${student?.fname || "Student"}`,
        message: status === "overdue" 
          ? `Fee installment #${fee.installmentNo} for ${student?.fname || "Student"} is overdue by ${Math.abs(daysRemaining)} day(s)`
          : `Fee installment #${fee.installmentNo} for ${student?.fname || "Student"} ${student?.lname || ""} is due in ${daysRemaining} day(s)`,
        studentName: `${student?.fname || ""} ${student?.lname || ""}`.trim(),
        studentEmail: student?.email,
        studentContact: student?.contact,
        installmentNo: fee.installmentNo,
        dueAmount: fee.remainingAmount,
        dueDate: fee.dueDate,
        daysRemaining: daysRemaining,
        status: status,
        urgencyLevel: urgencyLevel,
        createdAt: fee.createdAt
      };
    });

    return {
      success: true,
      count: notifications.length,
      data: notifications
    };
  } catch (error) {
    throw error;
  }
};
