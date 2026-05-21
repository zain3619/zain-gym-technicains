const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  imageUrl: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Testimonial", TestimonialSchema);
