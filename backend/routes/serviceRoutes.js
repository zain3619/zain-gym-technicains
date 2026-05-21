const express = require("express");
const router = express.Router();
const { getServices, getServiceById, createService, updateService, deleteService } = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.route("/")
  .get(getServices)
  .post(protect, upload.single("image"), createService);

router.route("/:id")
  .get(getServiceById)
  .put(protect, upload.single("image"), updateService)
  .delete(protect, deleteService);

module.exports = router;
