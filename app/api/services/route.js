import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import Service from "../../../models/Service";

export async function GET(req) {
  try {
    await connectDB();
    const services = await Service.find().sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch services", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    await verifyAuth(req);

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const icon = formData.get("icon") || "Dumbbell";
    const features = formData.get("features");
    const file = formData.get("image");

    let imageUrl = "";
    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "services");
      imageUrl = uploadResult.url;
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = JSON.parse(features);
      } catch {
        parsedFeatures = String(features).split(",").map(f => f.trim()).filter(Boolean);
      }
    }

    const service = await Service.create({
      title,
      description,
      imageUrl,
      icon,
      features: parsedFeatures,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Service POST Error:", error);
    return NextResponse.json({ message: "Failed to create service", error: error.message }, { status: 500 });
  }
}
