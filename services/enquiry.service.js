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
    const enquiryData = {
      fname: data.fname,
      mname: data.mname,
      lname: data.lname,
      contact: data.contact,
      email: data.email,
      address: data.address,
      qualification: data.qualification,
      requiredCourse: data.requiredCourse,
      requiredLocation: data.requiredLocation,
      gender: data.gender || null,
      reference: data.reference || null,
      testScore: data.testScore || null,

      enquiryNumber: generateEnquiryNumber(),

      // OPTIONAL ObjectIds
      eid: mongoose.Types.ObjectId.isValid(data.eid)
        ? data.eid
        : null,

      courseName: mongoose.Types.ObjectId.isValid(data.courseName)
        ? data.courseName
        : null,
    };

    return await Enquiry.create(enquiryData);
  } catch (error) {
    console.error("❌ Service Create Enquiry Error:", error.message);
    throw error;
  }
};

const getAllEnquiries = async () => {
  try {
    return await Enquiry.find().populate("eid courseName");
  } catch (error) {
    console.error("❌ Service Get Enquiries Error:", error.message);
    throw error;
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
};
