const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  business: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
  },
  budgetRange: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);
