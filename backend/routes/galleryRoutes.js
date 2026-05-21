const express = require("express");
const router = express.Router();
const { getGallery, uploadImages, editImageTitle, deleteImage } = require("../controllers/galleryController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.route("/")
  .get(getGallery)
  .post(protect, upload.array("images", 10), uploadImages);

router.route("/:id")
  .put(protect, editImageTitle)
  .delete(protect, deleteImage);

module.exports = router;
