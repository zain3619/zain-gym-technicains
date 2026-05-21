import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import Banner from "../../../../models/Banner";

export async function PUT(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const banner = await Banner.findById(params.id);

    if (!banner) {
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const type = formData.get("type");
    const isActiveStr = formData.get("isActive");
    const orderStr = formData.get("order");
    const file = formData.get("image");

    if (title) banner.title = title;
    if (type) banner.type = type;
    
    if (isActiveStr !== null && isActiveStr !== undefined) {
      banner.isActive = isActiveStr === "true";
    }
    
    if (orderStr) {
      banner.order = Number(orderStr) || 0;
    }

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "banners");
      banner.imageUrl = uploadResult.url;
    }

    await banner.save();
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Banner PUT Error:", error);
    return NextResponse.json({ message: "Failed to update banner", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const banner = await Banner.findById(params.id);

    if (!banner) {
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });
    }

    await banner.deleteOne();
    return NextResponse.json({ message: "Banner removed successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete banner", error: error.message }, { status: 500 });
  }
}
