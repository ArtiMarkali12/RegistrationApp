const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Recipient (Admin/Employee)
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // Notification Type
    type: {
      type: String,
      enum: ["FEE_REMINDER", "STUDENT_REGISTRATION", "GENERAL"],
      required: true,
    },

    // Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Message
    message: {
      type: String,
      required: true,
    },

    // Related Student (optional)
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    // Related Fees (optional)
    feesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fees",
    },

    // Related Enquiry (optional)
    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry",
    },

    // Urgency Level
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "normal",
    },

    // Status
    isRead: {
      type: Boolean,
      default: false,
    },

    // Additional Data
    data: {
      type: Object,
      default: {},
    },

    // Scheduled Date (for future notifications)
    scheduledDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ scheduledDate: 1, type: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
