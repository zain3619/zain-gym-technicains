import mongoose from "mongoose";

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

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
