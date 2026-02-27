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
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    qualification: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployeeReg", empRegSchema);