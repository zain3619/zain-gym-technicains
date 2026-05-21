import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import Service from "../../../../models/Service";

export async function GET(req, context) {
  try {
    await connectDB();
    const params = await context.params;
    const service = await Service.findById(params.id);
    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch service details", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const service = await Service.findById(params.id);

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const icon = formData.get("icon");
    const features = formData.get("features");
    const file = formData.get("image");

    if (title) service.title = title;
    if (description) service.description = description;
    if (icon) service.icon = icon;

    if (features) {
      try {
        service.features = JSON.parse(features);
      } catch {
        service.features = String(features).split(",").map(f => f.trim()).filter(Boolean);
      }
    }

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "services");
      service.imageUrl = uploadResult.url;
    }

    await service.save();
    return NextResponse.json(service);
  } catch (error) {
    console.error("Service PUT Error:", error);
    return NextResponse.json({ message: "Failed to update service", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const service = await Service.findById(params.id);

    if (!service) {
      return NextResponse.json({ message: "Service not found" }, { status: 404 });
    }

    await service.deleteOne();
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete service", error: error.message }, { status: 500 });
  }
}
