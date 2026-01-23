const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  // courseId: {
  //   type: String,        // eg: "CSE-101", "MBA-2025"
  //   required: true,
  //   unique: true,
  //   trim: true
  // },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  feesAmount: {
    type: Number,
    required: true,
    min: 0
  },
  feesPolicy: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  requiredQualification: {
    type: [String],     // eg: ["12th Pass", "Graduate"]
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
