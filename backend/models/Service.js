const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  icon: {
    type: String,
    default: "Dumbbell",
  },
  features: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("Service", ServiceSchema);
