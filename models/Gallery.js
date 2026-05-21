import mongoose from "mongoose";

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

export default mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
