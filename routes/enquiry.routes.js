
const router = require("express").Router();
const enquiryController = require("../controllers/enquiry.controller");

router.post("/", enquiryController.createEnquiry);   // public
router.get("/", enquiryController.getAllEnquiries); // admin use
router.get("/search/name", enquiryController.getEnquiryByName); // search by name

// Get enquiry by ID
router.get("/:id", enquiryController.getEnquiryById);

// Update enquiry
router.put("/:id", enquiryController.updateEnquiry);

// Delete enquiry
router.delete("/:id", enquiryController.deleteEnquiry);

module.exports = router;
