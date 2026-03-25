const Fees = require("../models/fees.model");
const Student = require("../models/student.model");
const Employee = require("../models/employee.model");
const Enquiry = require("../models/enquiry.model");
const Notification = require("../models/notification.model");

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

    // Find fees with next installment dates approaching and assigned to this employee
    const upcomingFees = await Fees.find({
      employeeId: employeeIdNum,
      nextInstallmentDate: {
        $gte: today,
        $lte: thresholdDate,
      },
      feesStatus: { $in: ["PENDING", "PARTIAL"] },
    })
      .populate("studentId", "fname lname email contact")
      .sort({ nextInstallmentDate: 1 });

    // Format notifications
    const notifications = upcomingFees.map((fee) => {
      const daysRemaining = Math.ceil(
        (fee.nextInstallmentDate - today) / (1000 * 60 * 60 * 24),
      );
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
        message: `Next fee installment for ${student?.fname || "Student"} ${student?.lname || ""} is due in ${daysRemaining} day(s)`,
        studentName: `${student?.fname || ""} ${student?.lname || ""}`.trim(),
        studentEmail: student?.email,
        studentContact: student?.contact,
        dueAmount: fee.remainingAmount,
        nextInstallmentDate: fee.nextInstallmentDate,
        daysRemaining: daysRemaining,
        urgencyLevel: urgencyLevel,
        createdAt: fee.createdAt,
      };
    });

    return {
      success: true,
      count: notifications.length,
      data: notifications,
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
      feesStatus: { $in: ["PENDING", "PARTIAL"] },
    })
      .populate("studentId", "fname lname email contact")
      .sort({ nextInstallmentDate: 1 });

    const notifications = allFees.map((fee) => {
      const daysRemaining = fee.nextInstallmentDate
        ? Math.ceil((fee.nextInstallmentDate - today) / (1000 * 60 * 60 * 24))
        : null;
      const student = fee.studentId;

      let status = "upcoming";
      let urgencyLevel = "normal";

      if (daysRemaining !== null && daysRemaining < 0) {
        status = "overdue";
        urgencyLevel = "critical";
      } else if (daysRemaining !== null && daysRemaining <= 2) {
        urgencyLevel = "high";
      } else if (daysRemaining !== null && daysRemaining <= 5) {
        urgencyLevel = "medium";
      }

      return {
        _id: fee._id,
        type: "FEE_DUE",
        title: `${status === "overdue" ? "OVERDUE" : "Fee Due"} - ${student?.fname || "Student"}`,
        message:
          status === "overdue"
            ? `Next fee installment for ${student?.fname || "Student"} is overdue by ${Math.abs(daysRemaining)} day(s)`
            : daysRemaining !== null
              ? `Next fee installment for ${student?.fname || "Student"} ${student?.lname || ""} is due in ${daysRemaining} day(s)`
              : `Next fee installment date not set for ${student?.fname || "Student"}`,
        studentName: `${student?.fname || ""} ${student?.lname || ""}`.trim(),
        studentEmail: student?.email,
        studentContact: student?.contact,
        dueAmount: fee.remainingAmount,
        nextInstallmentDate: fee.nextInstallmentDate,
        daysRemaining: daysRemaining,
        status: status,
        urgencyLevel: urgencyLevel,
        createdAt: fee.createdAt,
      };
    });

    return {
      success: true,
      count: notifications.length,
      data: notifications,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get student registration reminders for today
 * @param {string} employeeId - The logged-in employee's MongoDB ID
 */
exports.getStudentRegistrationReminders = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return { success: false, message: "Employee not found" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find enquiries with expected registration date today or in the past (pending)
    const enquiries = await Enquiry.find({
      expectedRegistrationDate: {
        $lte: tomorrow,
      },
      status: { $in: ["Pending", "In Progress"] },
    })
      .populate("eid", "fname lname email")
      .sort({ expectedRegistrationDate: 1 });

    // Format notifications
    const notifications = enquiries.map((enquiry) => {
      const daysRemaining = enquiry.expectedRegistrationDate
        ? Math.ceil(
            (enquiry.expectedRegistrationDate - today) / (1000 * 60 * 60 * 24),
          )
        : null;

      let status = "upcoming";
      let urgencyLevel = "normal";

      if (daysRemaining !== null && daysRemaining < 0) {
        status = "overdue";
        urgencyLevel = "high";
      } else if (daysRemaining === 0) {
        status = "today";
        urgencyLevel = "high";
      } else if (daysRemaining === 1) {
        status = "tomorrow";
        urgencyLevel = "medium";
      }

      return {
        _id: enquiry._id,
        type: "STUDENT_REGISTRATION",
        title: `Student Registration - ${enquiry.fname || "Student"}`,
        message:
          status === "today"
            ? `${enquiry.fname || "Student"} ${enquiry.lname || ""} is expected to register TODAY`
            : status === "overdue"
              ? `${enquiry.fname || "Student"} ${enquiry.lname || ""} registration pending (expected ${Math.abs(daysRemaining)} day(s) ago)`
              : `${enquiry.fname || "Student"} ${enquiry.lname || ""} expected to register in ${daysRemaining} day(s)`,
        studentName: `${enquiry.fname || ""} ${enquiry.lname || ""}`.trim(),
        studentEmail: enquiry.email,
        studentContact: enquiry.contact,
        enquiryNumber: enquiry.enquiryNumber,
        expectedRegistrationDate: enquiry.expectedRegistrationDate,
        daysRemaining: daysRemaining,
        status: status,
        urgencyLevel: urgencyLevel,
        course: enquiry.requiredCourse,
        createdAt: enquiry.createdAt,
      };
    });

    return {
      success: true,
      count: notifications.length,
      data: notifications,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get all notifications (fee + student registration)
 * @param {string} employeeId - The logged-in employee's MongoDB ID
 */
exports.getAllNotifications = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return { success: false, message: "Employee not found" };
    }

    const employeeIdNum = employee.employeeId;
    const today = new Date();

    console.log("🔍 Notification Debug:", {
      employeeId,
      employeeIdNum,
      today,
    });

    // Get fee notifications
    const allFees = await Fees.find({
      employeeId: employeeIdNum,
      feesStatus: { $in: ["PENDING", "PARTIAL"] },
    })
      .populate("studentId", "fname lname email contact")
      .sort({ nextInstallmentDate: 1 });

    console.log("💰 Fees found:", allFees.length);

    const feeNotifications = allFees.map((fee) => {
      const daysRemaining = fee.nextInstallmentDate
        ? Math.ceil((fee.nextInstallmentDate - today) / (1000 * 60 * 60 * 24))
        : null;
      const student = fee.studentId;

      let status = "upcoming";
      let urgencyLevel = "normal";

      if (daysRemaining !== null && daysRemaining < 0) {
        status = "overdue";
        urgencyLevel = "critical";
      } else if (daysRemaining !== null && daysRemaining <= 2) {
        urgencyLevel = "high";
      } else if (daysRemaining !== null && daysRemaining <= 5) {
        urgencyLevel = "medium";
      }

      return {
        _id: fee._id,
        type: "FEE_REMINDER",
        title: `${status === "overdue" ? "OVERDUE" : "Fee Due"} - ${student?.fname || "Student"}`,
        message:
          status === "overdue"
            ? `Next fee installment for ${student?.fname || "Student"} is overdue by ${Math.abs(daysRemaining)} day(s)`
            : daysRemaining !== null
              ? `Next fee installment for ${student?.fname || "Student"} ${student?.lname || ""} is due in ${daysRemaining} day(s)`
              : `Next fee installment date not set for ${student?.fname || "Student"}`,
        studentName: `${student?.fname || ""} ${student?.lname || ""}`.trim(),
        studentEmail: student?.email,
        studentContact: student?.contact,
        dueAmount: fee.remainingAmount,
        nextInstallmentDate: fee.nextInstallmentDate,
        daysRemaining: daysRemaining,
        status: status,
        urgencyLevel: urgencyLevel,
        createdAt: fee.createdAt,
      };
    });

    // Get student registration reminders
    const enquiries = await Enquiry.find({
      expectedRegistrationDate: {
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      status: { $in: ["Pending", "In Progress"] },
    }).sort({ expectedRegistrationDate: 1 });

    const registrationNotifications = enquiries.map((enquiry) => {
      const daysRemaining = enquiry.expectedRegistrationDate
        ? Math.ceil(
            (enquiry.expectedRegistrationDate - today) / (1000 * 60 * 60 * 24),
          )
        : null;

      let status = "upcoming";
      let urgencyLevel = "normal";

      if (daysRemaining !== null && daysRemaining < 0) {
        status = "overdue";
        urgencyLevel = "high";
      } else if (daysRemaining === 0) {
        status = "today";
        urgencyLevel = "high";
      } else if (daysRemaining === 1) {
        status = "tomorrow";
        urgencyLevel = "medium";
      }

      return {
        _id: enquiry._id,
        type: "STUDENT_REGISTRATION",
        title: `Student Registration - ${enquiry.fname || "Student"}`,
        message:
          status === "today"
            ? `${enquiry.fname || "Student"} ${enquiry.lname || ""} is expected to register TODAY`
            : status === "overdue"
              ? `${enquiry.fname || "Student"} ${enquiry.lname || ""} registration pending (expected ${Math.abs(daysRemaining)} day(s) ago)`
              : `${enquiry.fname || "Student"} ${enquiry.lname || ""} expected to register in ${daysRemaining} day(s)`,
        studentName: `${enquiry.fname || ""} ${enquiry.lname || ""}`.trim(),
        studentEmail: enquiry.email,
        studentContact: enquiry.contact,
        enquiryNumber: enquiry.enquiryNumber,
        expectedRegistrationDate: enquiry.expectedRegistrationDate,
        daysRemaining: daysRemaining,
        status: status,
        urgencyLevel: urgencyLevel,
        course: enquiry.requiredCourse,
        createdAt: enquiry.createdAt,
      };
    });

    // Combine and sort by urgency
    const allNotifications = [
      ...feeNotifications,
      ...registrationNotifications,
    ].sort((a, b) => {
      const urgencyOrder = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
        normal: 4,
      };
      return urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];
    });

    return {
      success: true,
      count: allNotifications.length,
      data: allNotifications,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} employeeId - Employee ID for verification
 */
exports.markNotificationAsRead = async (notificationId, employeeId) => {
  try {
    const Notification = require("../models/notification.model");

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: employeeId },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return { success: false, message: "Notification not found" };
    }

    return {
      success: true,
      message: "Notification marked as read",
      data: notification,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @param {string} employeeId - Employee ID
 */
exports.markAllNotificationsAsRead = async (employeeId) => {
  try {
    const Notification = require("../models/notification.model");

    await Notification.updateMany(
      { recipientId: employeeId, isRead: false },
      { isRead: true },
    );

    return {
      success: true,
      message: "All notifications marked as read",
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get unread notification count
 * @param {string} employeeId - Employee ID
 */
exports.getUnreadNotificationCount = async (employeeId) => {
  try {
    const Notification = require("../models/notification.model");

    const count = await Notification.countDocuments({
      recipientId: employeeId,
      isRead: false,
    });

    return {
      success: true,
      count: count,
    };
  } catch (error) {
    throw error;
  }
};
