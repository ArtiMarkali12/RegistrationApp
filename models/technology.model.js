const mongoose = require("mongoose");

const technologySchema = new mongoose.Schema(
  {
    // techId: {
    //   type: String,      // eg: "TECH-001"
    //   required: true,
    //   unique: true,
    //   trim: true
    // },
    techName: {
      type: String, // eg: "React JS"
      required: true,
      trim: true,
    },
    duration: {
      type: String, // eg: "3 Months"
      trim: true,
    },
    version: {
      type: String, // eg: "18.2"
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Technology", technologySchema);
