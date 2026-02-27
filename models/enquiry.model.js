// const mongoose = require("mongoose");

// const enquirySchema = new mongoose.Schema(
//   {
//     fname: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     mname: {
//       type: String,
//       trim: true,
//     },
//     lname: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     contact: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//       match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
//     },
//     address: {
//       type: String,
//       trim: true,
//     },
//     qualification: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     requiredCourse: {
//       type: String, // <-- Changed from ObjectId + ref to simple String
//       required: true,
//       trim: true,
//     },
//     requiredLocation: {
//       type: String,
//       trim: true,
//     },
//     eid: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Employee",
//       required: true,
//     },
//     testScore: {
//       type: Number,
//       min: 0,
//     },
//     reference: {
//       type: String,
//       trim: true,
//     },
//     courseName: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "CourseTech",
//     },
//     gender: {
//       type: String,
//       enum: ["Male", "Female", "Other"],
//     },
//     enquiryNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// module.exports = mongoose.model("Enquiry", enquirySchema);








const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
