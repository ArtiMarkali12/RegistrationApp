const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    registration_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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
    contact: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    address: String,
    qualification: String,
    requiredCourse: String,
    requiredLocation: String,

    eid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    DOB: Date,
    parentName: String,
    parentContact: String,
    parentOccupation: String,

    photo: String, // Base64 image
    signature: String, // Base64 image

    readyToWork: {
      type: Boolean,
      default: false,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    gradePercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    aadhaarNumber: {
      type: String,
      trim: true,
      match: [/^\d{12}$/, "Aadhaar number must be 12 digits"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
