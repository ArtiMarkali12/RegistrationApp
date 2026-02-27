const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Department",
  new mongoose.Schema({
    dept_name: { 
      type: String, 
      unique: true,
      enum: ["admin", "finance"]
    },
    location: String,
  }),
);
