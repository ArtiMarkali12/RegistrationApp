const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  registration_no: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fname: {
    type: String,
    required: true,
    trim: true
  },
  mname: {
    type: String,
    trim: true
  },
  lname: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  address: {
    type: String,
    trim: true
  },
  qualification: {
    type: String,
    trim: true
  },
  requiredCourse: {
    type: String,
    trim: true
  },
  requiredLocation: {
    type: String,
    trim: true
  },
  eid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  DOB: {
    type: Date
  },
  parentName: {
    type: String,
    trim: true
  },
  parentContact: {
    type: String,
    trim: true
  },
  parentOccupation: {
    type: String,
    trim: true
  },
  photo: {
    type: String,  // URL or base64 string
    trim: true
  },
  signature: {
    type: String,  // URL or base64 string
    trim: true
  },
  readyToWork: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  gradePercentage: {
    type: Number,
    min: 0,
    max: 100
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
