const CourseTech = require("../models/courseTech.model");
const Course = require("../models/course.model");
const Technology = require("../models/technology.model");

// ------------------------
// Create a course-tech relation
// ------------------------
exports.createCourseTech = async (req, res, next) => {
  try {
    const { courseId, techId } = req.body;

    if (!courseId || !techId) {
      return res.status(400).json({
        success: false,
        message: "courseId and techId are required",
      });
    }

    // Check if relation already exists
    const exists = await CourseTech.findOne({ courseId, techId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "This course-technology relation already exists",
      });
    }

    const courseTech = await CourseTech.create({ courseId, techId });

    // Populate course and tech details in response
    await courseTech.populate([
      { path: "courseId", select: "name feesAmount requiredQualification duration" },
      { path: "techId", select: "techId techName version duration" },
    ]);

    res.status(201).json({ success: true, data: courseTech });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Get all course-tech relations
// ------------------------
exports.getCourseTechs = async (req, res, next) => {
  try {
    const courseTechs = await CourseTech.find()
      .populate("courseId", "name")
      .populate("techId", "techName");

    res.status(200).json({
      success: true,
      count: courseTechs.length,
      data: courseTechs,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Get a single course-tech by ID
// ------------------------
exports.getCourseTechById = async (req, res, next) => {
  try {
    const courseTech = await CourseTech.findById(req.params.id)
      .populate("courseId", "name feesAmount requiredQualification duration")
      .populate("techId", "techId techName version duration");

    if (!courseTech) {
      return res.status(404).json({
        success: false,
        message: "CourseTech relation not found",
      });
    }

    res.status(200).json({ success: true, data: courseTech });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Update course-tech relation by ID
// ------------------------
exports.updateCourseTech = async (req, res, next) => {
  try {
    const updatedCourseTech = await CourseTech.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("courseId", "name feesAmount requiredQualification duration")
      .populate("techId", "techId techName version duration");

    if (!updatedCourseTech) {
      return res.status(404).json({
        success: false,
        message: "CourseTech relation not found",
      });
    }

    res.status(200).json({ success: true, data: updatedCourseTech });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Delete course-tech relation by ID
// ------------------------
exports.deleteCourseTech = async (req, res, next) => {
  try {
    const deletedCourseTech = await CourseTech.findByIdAndDelete(req.params.id);

    if (!deletedCourseTech) {
      return res.status(404).json({
        success: false,
        message: "CourseTech relation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "CourseTech relation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------
// Get all technologies for a specific course
// ------------------------
exports.getCourseWithTechs = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const courseTechs = await CourseTech.find({ courseId })
      .populate("courseId", "name feesAmount requiredQualification duration")
      .populate("techId", "techId techName version duration");

    if (!courseTechs.length) {
      return res.status(404).json({
        success: false,
        message: "No technologies found for this course",
      });
    }

    res.status(200).json({ success: true, data: courseTechs });
  } catch (error) {
    next(error);
  }
};
