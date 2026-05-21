const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  socialLinks: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
}, { timestamps: true });

module.exports = mongoose.model("Team", TeamSchema);
