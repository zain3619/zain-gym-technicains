const PricingPlan = require("../models/PricingPlan");

exports.getPricingPlans = async (req, res) => {
  try {
    const plans = await PricingPlan.find().sort({ createdAt: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pricing plans", error: error.message });
  }
};

exports.createPricingPlan = async (req, res) => {
  try {
    const { name, price, billingPeriod, features, isFeatured } = req.body;

    let parsedFeatures = [];
    if (features) {
      if (typeof features === "string") {
        try {
          parsedFeatures = JSON.parse(features);
        } catch {
          parsedFeatures = features.split(",").map(f => f.trim()).filter(Boolean);
        }
      } else if (Array.isArray(features)) {
        parsedFeatures = features;
      }
    }

    const plan = await PricingPlan.create({
      name,
      price,
      billingPeriod: billingPeriod || "month",
      features: parsedFeatures,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Failed to create pricing plan", error: error.message });
  }
};

exports.updatePricingPlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Pricing plan not found" });

    const { name, price, billingPeriod, features, isFeatured } = req.body;
    if (name) plan.name = name;
    if (price) plan.price = price;
    if (billingPeriod) plan.billingPeriod = billingPeriod;
    if (isFeatured !== undefined) plan.isFeatured = isFeatured === "true" || isFeatured === true;

    if (features) {
      if (typeof features === "string") {
        try {
          plan.features = JSON.parse(features);
        } catch {
          plan.features = features.split(",").map(f => f.trim()).filter(Boolean);
        }
      } else if (Array.isArray(features)) {
        plan.features = features;
      }
    }

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Failed to update pricing plan", error: error.message });
  }
};

exports.deletePricingPlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Pricing plan not found" });

    await plan.deleteOne();
    res.json({ message: "Pricing plan removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pricing plan", error: error.message });
  }
};
