const express = require("express");
const router = express.Router();
const { getHero, updateHero, getAbout, updateAbout, getSettings, updateSettings } = require("../controllers/sectionController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.route("/hero")
  .get(getHero)
  .put(protect, upload.single("image"), updateHero);

router.route("/about")
  .get(getAbout)
  .put(protect, upload.single("image"), updateAbout);

router.route("/settings")
  .get(getSettings)
  .put(protect, upload.single("logo"), updateSettings);

module.exports = router;
