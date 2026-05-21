import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";
import PricingPlan from "../../../models/PricingPlan";

export async function GET(req) {
  try {
    await connectDB();
    const plans = await PricingPlan.find().sort({ price: 1 });
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch pricing plans", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    await verifyAuth(req);

    const { name, price, billingPeriod, features, isFeatured } = await req.json();

    if (!name || !price) {
      return NextResponse.json({ message: "Name and price are required fields" }, { status: 400 });
    }

    const plan = await PricingPlan.create({
      name,
      price,
      billingPeriod: billingPeriod || "month",
      features: features || [],
      isFeatured: !!isFeatured,
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Pricing POST Error:", error);
    return NextResponse.json({ message: "Failed to create pricing plan", error: error.message }, { status: 500 });
  }
}
