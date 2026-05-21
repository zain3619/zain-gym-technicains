import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  logo: {
    type: String,
    default: "",
  },
  footerText: {
    type: String,
    default: "Zain Gym Technicians. All rights reserved.",
  },
  phone: {
    type: String,
    default: "+92 323 3334777",
  },
  email: {
    type: String,
    default: "m.qaiser76@yahoo.com",
  },
  address: {
    type: String,
    default: "120, A Block Irrigation Co-operative Housing Society Near Race Club Kot Lakhpat, Lahore, Pakistan",
  },
  openingHours: {
    type: String,
    default: "Mon - Sun: 9:00 AM - 8:00 PM (Sunday: By Appointment)",
  },
  socialLinks: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
