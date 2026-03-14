const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema(
  {
    /* ===== FOREIGN KEYS ===== */
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.Mixed, // Accept both ObjectId and Number
      default: null,
    },

    /* ===== FEES DETAILS ===== */
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

    totalAmount: {
      type: Number,
      min: 0,
    },

    totalPaid: {
      type: Number,
      min: 0,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      min: 0,
      required: true,
      default: 0,
    },

    feesStatus: {
      type: String,
      enum: ["PENDING", "PARTIAL", "COMPLETED"],
      default: "PENDING",
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

    nextInstallmentDate: {
      type: Date,
    },

    currentDate: {
      type: Date,
      default: Date.now,
    },

    /* ===== PAYMENT INFO ===== */
    modeOfPayment: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "NET_BANKING"],
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

    /* ===== PAYMENT HISTORY (Installment Tracking) ===== */
    paymentHistory: [
      {
        paidAmount: Number,
        modeOfPayment: String,
        transactionId: String,
        receiptNumber: String,
        paymentDate: {
          type: Date,
          default: Date.now,
        },
        employeeId: {
          type: mongoose.Schema.Types.Mixed, // Accept both ObjectId and Number
        },
        nextInstallmentDate: Date,
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to auto-calculate remaining amount and status
feesSchema.pre("save", function () {
  // Auto-calculate totalAmount if missing
  if (!this.totalAmount || this.totalAmount <= 0) {
    this.totalAmount = this.actualFees || 0;
  }

  // Calculate remaining amount (handle undefined values)
  const totalAmount = this.totalAmount || 0;
  const totalPaid = this.totalPaid || 0;

  this.remainingAmount = totalAmount - totalPaid;

  // Update fees status
  if (this.remainingAmount <= 0 && totalAmount > 0) {
    this.feesStatus = "COMPLETED";
  } else if (totalPaid > 0) {
    this.feesStatus = "PARTIAL";
  } else {
    this.feesStatus = "PENDING";
  }
});

module.exports = mongoose.model("Fees", feesSchema);
