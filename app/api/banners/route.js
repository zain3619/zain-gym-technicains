import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import Banner from "../../../models/Banner";

export async function GET(req) {
  try {
    await connectDB();
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch banners", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    await verifyAuth(req);

    const formData = await req.formData();
    const title = formData.get("title");
    const type = formData.get("type") || "homepage";
    const isActiveStr = formData.get("isActive");
    const orderStr = formData.get("order") || "0";
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Please provide banner image" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await uploadToCloudinary(buffer, "banners");

    const isActive = isActiveStr === "true";

    const banner = await Banner.create({
      title,
      imageUrl: uploadResult.url,
      type,
      isActive,
      order: Number(orderStr) || 0,
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Banner POST Error:", error);
    return NextResponse.json({ message: "Failed to create banner", error: error.message }, { status: 500 });
  }
}
