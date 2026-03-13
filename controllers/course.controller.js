const Course = require("../models/course.model");

// ➕ Create Course
exports.createCourse = async (req, res, next) => {
  try {
    const {
      name,
      feesAmount,
      feesPolicy,
      duration,
      requiredQualification
    } = req.body;

    if ( !name || feesAmount === undefined || !requiredQualification) {
      return res.status(400).json({
        success: false,
        message: " name, feesAmount and requiredQualification are required"
      });
    }

    const existingCourse = await Course.findOne({
      $or: [
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

// 🔍 Search Courses by Name (Partial Match)
exports.searchCourses = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query"
      });
    }

    const courses = await Course.find({
      name: new RegExp(query, "i")
    }).sort({ name: 1 });

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No courses found matching "${query}"`
      });
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// 🔍 Get Course by Name or ID
exports.getCourseByNameOrId = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    let course;

    // Check if identifier looks like a MongoDB ObjectId (24 hex characters)
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // It's likely an ObjectId, search by _id first
      course = await Course.findById(identifier);
    }

    // If not found by _id or not an ObjectId, search by name
    if (!course) {
      course = await Course.findOne({
        name: new RegExp(`^${identifier}$`, "i")
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    // If Cast error occurs, try searching by name instead
    if (error.name === 'CastError') {
      try {
        const course = await Course.findOne({
          name: new RegExp(`^${identifier}$`, "i")
        });

        if (!course) {
          return res.status(404).json({
            success: false,
            message: "Course not found"
          });
        }

        res.status(200).json({
          success: true,
          data: course
        });
      } catch (nameError) {
        next(nameError);
      }
    } else {
      next(error);
    }
  }
};
