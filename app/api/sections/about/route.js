import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import About from "../../../../models/About";

export async function GET(req) {
  try {
    await connectDB();
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch about settings", error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    await verifyAuth(req);
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const experienceYears = formData.get("experienceYears");
    const gymsBuilt = formData.get("gymsBuilt");
    const clientSatisfaction = formData.get("clientSatisfaction");
    const file = formData.get("image");

    if (title) about.title = title;
    if (description) about.description = description;
    if (experienceYears) about.experienceYears = Number(experienceYears) || 0;
    if (gymsBuilt) about.gymsBuilt = Number(gymsBuilt) || 0;
    if (clientSatisfaction) about.clientSatisfaction = clientSatisfaction;

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "about");
      about.imageUrl = uploadResult.url;
    }

    await about.save();
    return NextResponse.json(about);
  } catch (error) {
    console.error("About PUT Error:", error);
    return NextResponse.json({ message: "Failed to update about settings", error: error.message }, { status: 500 });
  }
}
