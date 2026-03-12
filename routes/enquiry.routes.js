
const router = require("express").Router();
const enquiryController = require("../controllers/enquiry.controller");

router.post("/", enquiryController.createEnquiry);   // public
router.get("/", enquiryController.getAllEnquiries); // admin use
router.get("/search/name", enquiryController.getEnquiryByName); // search by name

module.exports = router;
