const Course = require("../models/course.model");

// ➕ Create Course
exports.createCourse = async (req, res, next) => {
  try {
    const {
      courseId,
      name,
      feesAmount,
      feesPolicy,
      duration,
      requiredQualification
    } = req.body;

    if (!courseId || !name || feesAmount === undefined || !requiredQualification) {
      return res.status(400).json({
        success: false,
        message: "courseId, name, feesAmount and requiredQualification are required"
      });
    }

    const existingCourse = await Course.findOne({
      $or: [
        { courseId: courseId.trim() },
        { name: name.trim() }
      ]
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course with this courseId or name already exists"
      });
    }

    const course = await Course.create({
      courseId: courseId.trim(),
      name: name.trim(),
      feesAmount,
      feesPolicy: feesPolicy?.trim(),
      duration: duration?.trim(),
      requiredQualification
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// 📄 Get All Courses
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// 🔍 Get Course By ID
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// ✏️ Update Course
exports.updateCourse = async (req, res, next) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCourse)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    next(error);
  }
};

// 🗑️ Delete Course
exports.deleteCourse = async (req, res, next) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};
