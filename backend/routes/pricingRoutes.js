const express = require("express");
const router = express.Router();
const { getPricingPlans, createPricingPlan, updatePricingPlan, deletePricingPlan } = require("../controllers/pricingController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .get(getPricingPlans)
  .post(protect, createPricingPlan);

router.route("/:id")
  .put(protect, updatePricingPlan)
  .delete(protect, deletePricingPlan);

module.exports = router;
