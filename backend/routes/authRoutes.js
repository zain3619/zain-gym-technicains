const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  getProfile, 
  forgotPassword, 
  updateProfileImage, 
  updateCredentials 
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.post("/forgot-password", forgotPassword);

// New profile and setting endpoints
router.put("/profile-image", protect, upload.single("image"), updateProfileImage);
router.put("/update-credentials", protect, updateCredentials);

module.exports = router;
