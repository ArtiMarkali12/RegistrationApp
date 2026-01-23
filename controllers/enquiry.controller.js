const Enquiry = require("../models/enquiry.model");

const createEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

const getAllEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find().populate("eid courseName");
    res.status(200).json({
      success: true,
      data: enquiries
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries
};
