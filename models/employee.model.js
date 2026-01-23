const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: Number,
    default: 1,      // ✅ by default employeeId = 1
    unique: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  designation: {
    type: String
  },
  gender: {
    type: String
  },
  qualification: {
    type: String
  },
  deptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
