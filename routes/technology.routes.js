const express = require("express");
const router = express.Router();

const {
  createTechnology,
  getTechnologies,
  getTechnologyById,
  updateTechnology,
  deleteTechnology
} = require("../controllers/technology.controller");

router.post("/", createTechnology);  // POST route for /api/technologies

// बाकी routes
router.get("/", getTechnologies);
router.get("/:id", getTechnologyById);
router.put("/:id", updateTechnology);
router.delete("/:id", deleteTechnology);

module.exports = router;
