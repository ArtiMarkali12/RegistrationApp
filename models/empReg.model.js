const mongoose = require("mongoose");

const empRegSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    mname: {
      type: String,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
    },
    dept_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    qualification: {
      type: String,
      required: false,
    },
    email: {
      type: String,
    //   required: true,
      unique: true,
      lowercase: true,
    },
    mobileNo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    accessRights: {
      type: [String],
      default: []
    },
    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployeeReg", empRegSchema);