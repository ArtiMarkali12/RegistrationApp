const mongoose = require("mongoose");

// 🔹 Register Employee model (REQUIRED for populate to work)
require("./employee.model");

const enquirySchema = new mongoose.Schema(
  {
    fname: { type: String, required: true, trim: true },
    mname: { type: String, trim: true },
    lname: { type: String, required: true, trim: true },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    address: { type: String, trim: true },

    qualification: { type: String, required: true },

    requiredCourse: { type: String, required: true },

    requiredLocation: { type: String },

    // 🔹 PUBLIC FORM साठी required काढला
    eid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    testScore: { type: Number, min: 0 },

    reference: { type: String },

    courseName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseTech",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    enquiryNumber: {
      type: String,
      unique: true,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Converted", "Closed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
