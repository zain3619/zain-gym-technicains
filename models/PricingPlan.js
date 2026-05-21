import mongoose from "mongoose";

const PricingPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
  },
  billingPeriod: {
    type: String,
    default: "month",
  },
  features: {
    type: [String],
    default: [],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.PricingPlan || mongoose.model("PricingPlan", PricingPlanSchema);
