const mongoose = require("mongoose");

const courseTechSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId, // foreign key
      ref: "Course",                        // reference to Course collection
      required: true
    },
    techId: {
      type: mongoose.Schema.Types.ObjectId, // foreign key
      ref: "Technology",                    // reference to Technology collection
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseTech", courseTechSchema);
