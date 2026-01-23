const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema(
  {
    /* ===== FOREIGN KEYS ===== */
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Must match Student collection name
      required: true,
    },

    employeeId: {
      type: Number,
      default: 1,
    },

    /* ===== FEES DETAILS ===== */
    remainingAmount: {
      type: Number,
      min: 0,
      required: true,
    },

    installmentNo: {
      type: Number,
      min: 1,
    },

    paidAmount: {
      type: Number,
      min: 0,
      required: true,
    },

    actualFees: {
      type: Number,
      min: 0,
      required: true,
    },

    discount: {
      type: Number,
      min: 0,
      default: 0,
    },

    total: {
      type: Number,
      min: 0,
      required: true,
    },

    /* ===== DATES ===== */
    statementDate: {
      type: Date,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    currentDate: {
      type: Date,
      default: Date.now,
    },

    /* ===== PAYMENT INFO ===== */
    modeOfPayment: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "NET_BANKING"],
      required: true,
    },

    transactionId: {
      type: String,
      validate: {
        validator: function (v) {
          if (this.modeOfPayment === "CASH") return true;
          return v && v.length > 5;
        },
        message: "Transaction ID is required for non-cash payments",
      },
    },

    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fees", feesSchema);
