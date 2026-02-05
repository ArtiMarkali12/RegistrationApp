// const Enquiry = require("../models/enquiry.model");

// const createEnquiry = async (data) => {
//   return await Enquiry.create(data);
// };

// const getAllEnquiries = async () => {
//   return await Enquiry.find().populate("eid courseName");
// };

// module.exports = {
//   createEnquiry,
//   getAllEnquiries
// };


const Enquiry = require("../models/enquiry.model");
const mongoose = require("mongoose");

const generateEnquiryNumber = () => {
  return "ENQ-" + Date.now();
};

const createEnquiry = async (data) => {
  try {
    // ❌ default gender नाही
    if (!data.gender) {
      throw new Error("Gender is required");
    }

    if (!data.courseName || typeof data.courseName !== "string") {
      data.courseName = "";
    }

    if (!mongoose.Types.ObjectId.isValid(data.eid)) {
      data.eid = null;
    }

    const enquiryData = {
      ...data,
      enquiryNumber: generateEnquiryNumber(),
      eid: data.eid || null,
    };

    return await Enquiry.create(enquiryData);
  } catch (error) {
    console.error("Service Create Enquiry Error:", error.message);
    throw error;
  }
};

const getAllEnquiries = async () => {
  try {
    return await Enquiry.find().populate("eid");
  } catch (error) {
    console.error("Service Get Enquiries Error:", error.message);
    throw error;
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
};