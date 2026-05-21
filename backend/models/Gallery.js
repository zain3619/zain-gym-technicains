const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Cardio Machines", "Strength Equipment", "Free Weights", "Functional Training"],
    default: "Strength Equipment",
  },
  publicId: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Gallery", GallerySchema);
