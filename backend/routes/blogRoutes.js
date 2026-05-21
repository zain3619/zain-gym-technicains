const express = require("express");
const router = express.Router();
const { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require("../controllers/blogController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.route("/")
  .get(getBlogs)
  .post(protect, upload.single("image"), createBlog);

router.route("/slug/:slug")
  .get(getBlogBySlug);

router.route("/:id")
  .put(protect, upload.single("image"), updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
