import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    default: "Complete Gym Setup",
  },
  subheading: {
    type: String,
    required: true,
    default: "From Design to Equipment Supply",
  },
  backgroundImage: {
    type: String,
    required: true,
    default: "/hero-gym.png",
  },
  ctaText1: {
    type: String,
    default: "GET STARTED",
  },
  ctaLink1: {
    type: String,
    default: "/contact",
  },
  ctaText2: {
    type: String,
    default: "CONTACT US",
  },
  ctaLink2: {
    type: String,
    default: "/contact",
  },
}, { timestamps: true });

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
