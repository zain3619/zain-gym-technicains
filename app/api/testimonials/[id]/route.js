import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import Testimonial from "../../../../models/Testimonial";

export async function GET(req, context) {
  try {
    await connectDB();
    const params = await context.params;
    const testimonial = await Testimonial.findById(params.id);
    if (!testimonial) {
      return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch testimonial details", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const testimonial = await Testimonial.findById(params.id);

    if (!testimonial) {
      return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const role = formData.get("role");
    const text = formData.get("text");
    const textRoman = formData.get("textRoman");
    const rating = formData.get("rating");
    const file = formData.get("image");

    if (name) testimonial.name = name;
    if (role) testimonial.role = role;
    if (text) testimonial.text = text;
    if (textRoman != null) testimonial.textRoman = textRoman;
    if (rating) testimonial.rating = Number(rating);

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "testimonials");
      testimonial.imageUrl = uploadResult.url;
    }

    await testimonial.save();
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Testimonial PUT Error:", error);
    return NextResponse.json({ message: "Failed to update testimonial", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const testimonial = await Testimonial.findById(params.id);

    if (!testimonial) {
      return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }

    await testimonial.deleteOne();
    return NextResponse.json({ message: "Testimonial removed successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete testimonial", error: error.message }, { status: 500 });
  }
}
