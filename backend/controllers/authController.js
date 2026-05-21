const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production", {
    expiresIn: "30d",
  });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || "",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || "",
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(444).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile", error: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }
    
    const uploadResult = await uploadToCloudinary(req.file.buffer, "admin-profiles");
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(444).json({ message: "User not found" });
    }
    
    user.profileImage = uploadResult.url;
    await user.save();
    
    res.json({
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile image", error: error.message });
  }
};

exports.updateCredentials = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(444).json({ message: "User not found" });
    }
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // pre-save hook hashes this!
    
    await user.save();
    
    res.json({
      message: "Account settings updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update account settings", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(444).json({ message: "No admin account associated with this email" });
    }
    res.json({
      message: "Reset instructions simulated. In production, an email would be sent.",
      mockResetUrl: `/admin/reset-password?token=${generateToken(user._id)}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Forgot password failed", error: error.message });
  }
};
