const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: Number,
    default: 1,
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
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  mobileNo: {
    type: String,
    trim: true
  },
  password: {
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
  superAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuperAdmin"
  },
  accessRights: {
    type: [String],
    default: []
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

employeeSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Employee", employeeSchema);
