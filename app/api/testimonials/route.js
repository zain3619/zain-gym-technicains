import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import Testimonial from "../../../models/Testimonial";

export async function GET(req) {
  try {
    await connectDB();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    await verifyAuth(req);

    const formData = await req.formData();
    const name = formData.get("name");
    const role = formData.get("role");
    const text = formData.get("text");
    const textRoman = formData.get("textRoman") || "";
    const rating = formData.get("rating") || 5;
    const file = formData.get("image");

    let imageUrl = "";
    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "testimonials");
      imageUrl = uploadResult.url;
    }

    const testimonial = await Testimonial.create({
      name,
      role,
      text,
      textRoman,
      rating: Number(rating) || 5,
      imageUrl,
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Testimonial POST Error:", error);
    return NextResponse.json({ message: "Failed to create testimonial", error: error.message }, { status: 500 });
  }
}
