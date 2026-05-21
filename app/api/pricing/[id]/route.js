import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import PricingPlan from "../../../../models/PricingPlan";

export async function PUT(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const plan = await PricingPlan.findById(params.id);

    if (!plan) {
      return NextResponse.json({ message: "Pricing plan not found" }, { status: 404 });
    }

    const { name, price, billingPeriod, features, isFeatured } = await req.json();

    if (name) plan.name = name;
    if (price) plan.price = price;
    if (billingPeriod) plan.billingPeriod = billingPeriod;
    if (features) plan.features = features;
    
    if (isFeatured !== null && isFeatured !== undefined) {
      plan.isFeatured = !!isFeatured;
    }

    await plan.save();
    return NextResponse.json(plan);
  } catch (error) {
    console.error("Pricing PUT Error:", error);
    return NextResponse.json({ message: "Failed to update pricing plan", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const plan = await PricingPlan.findById(params.id);

    if (!plan) {
      return NextResponse.json({ message: "Pricing plan not found" }, { status: 404 });
    }

    await plan.deleteOne();
    return NextResponse.json({ message: "Pricing plan deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete pricing plan", error: error.message }, { status: 500 });
  }
}
