import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "We Build More Than Gyms We Build Experiences.",
  },
  description: {
    type: String,
    required: true,
    default: "From concept to completion, we deliver gym design, gym building, gym setup services, top-tier fitness equipment, and expert support.",
  },
  imageUrl: {
    type: String,
    required: true,
    default: "/about-team.png",
  },
  experienceYears: {
    type: Number,
    default: 14,
  },
  gymsBuilt: {
    type: Number,
    default: 30,
  },
  clientSatisfaction: {
    type: String,
    default: "100%",
  },
}, { timestamps: true });

export default mongoose.models.About || mongoose.model("About", AboutSchema);
