import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import Team from "../../../models/Team";

export async function GET(req) {
  try {
    await connectDB();
    const team = await Team.find().sort({ createdAt: -1 });
    return NextResponse.json(team);
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
    const experience = formData.get("experience");
    const file = formData.get("image");
    const facebook = formData.get("facebook") || "";
    const instagram = formData.get("instagram") || "";
    const twitter = formData.get("twitter") || "";
    const linkedin = formData.get("linkedin") || "";

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Please provide team member image" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await uploadToCloudinary(buffer, "team");

    const member = await Team.create({
      name,
      role,
      experience,
      imageUrl: uploadResult.url,
      socialLinks: {
        facebook,
        instagram,
        twitter,
        linkedin,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Team POST Error:", error);
    return NextResponse.json({ message: "Failed to create team member", error: error.message }, { status: 500 });
  }
}
