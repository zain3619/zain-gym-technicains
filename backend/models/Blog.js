const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "Fitness",
  },
  seoTitle: {
    type: String,
    trim: true,
  },
  seoDescription: {
    type: String,
    trim: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Blog", BlogSchema);
