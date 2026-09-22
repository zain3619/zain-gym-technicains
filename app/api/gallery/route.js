import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import Gallery from "../../../models/Gallery";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query = {};
    if (category) {
      query.category = category;
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    await verifyAuth(req);

    const formData = await req.formData();
    const title = formData.get("title") || "";
    const category = formData.get("category") || "Strength Equipment";
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Please provide an image to upload" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await uploadToCloudinary(buffer, "gallery");

    const item = await Gallery.create({
      title,
      category,
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Gallery POST Error:", error);
    return NextResponse.json({ message: "Failed to add gallery item", error: error.message }, { status: 500 });
  }
}
