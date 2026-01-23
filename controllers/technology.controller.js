const Technology = require("../models/technology.model");

// ➕ Create Technology
exports.createTechnology = async (req, res, next) => {
  try {
    const { techId, techName, duration, version } = req.body;

    if (!techId || !techName) {
      return res.status(400).json({
        success: false,
        message: "techId and techName are required"
      });
    }

    const existingTech = await Technology.findOne({
      $or: [{ techId: techId.trim() }, { techName: techName.trim() }]
    });

    if (existingTech) {
      return res.status(400).json({
        success: false,
        message: "Technology with this techId or techName already exists"
      });
    }

    const technology = await Technology.create({
      techId: techId.trim(),
      techName: techName.trim(),
      duration: duration?.trim(),
      version: version?.trim()
    });

    res.status(201).json({ success: true, data: technology });
  } catch (error) {
    next(error);
  }
};

// 📄 Get All Technologies
exports.getTechnologies = async (req, res, next) => {
  try {
    const technologies = await Technology.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: technologies.length,
      data: technologies
    });
  } catch (error) {
    next(error);
  }
};

// 🔍 Get Technology By ID
exports.getTechnologyById = async (req, res, next) => {
  try {
    const technology = await Technology.findById(req.params.id);
    if (!technology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found"
      });
    }

    res.status(200).json({ success: true, data: technology });
  } catch (error) {
    next(error);
  }
};

// ✏️ Update Technology
exports.updateTechnology = async (req, res, next) => {
  try {
    const updatedTechnology = await Technology.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTechnology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found"
      });
    }

    res.status(200).json({ success: true, data: updatedTechnology });
  } catch (error) {
    next(error);
  }
};

// 🗑️ Delete Technology
exports.deleteTechnology = async (req, res, next) => {
  try {
    const deletedTechnology = await Technology.findByIdAndDelete(req.params.id);

    if (!deletedTechnology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Technology deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
