const Enquiry = require("../models/enquiry.model");

const createEnquiry = async (data) => {
  return await Enquiry.create(data);
};

const getAllEnquiries = async () => {
  return await Enquiry.find().populate("eid courseName");
};

module.exports = {
  createEnquiry,
  getAllEnquiries
};
