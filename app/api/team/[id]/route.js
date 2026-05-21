import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import Team from "../../../../models/Team";

export async function GET(req, context) {
  try {
    await connectDB();
    const params = await context.params;
    const member = await Team.findById(params.id);
    if (!member) {
      return NextResponse.json({ message: "Team member not found" }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch member details", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const member = await Team.findById(params.id);

    if (!member) {
      return NextResponse.json({ message: "Team member not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const role = formData.get("role");
    const experience = formData.get("experience");
    const file = formData.get("image");
    
    const facebook = formData.get("facebook");
    const instagram = formData.get("instagram");
    const twitter = formData.get("twitter");
    const linkedin = formData.get("linkedin");

    if (name) member.name = name;
    if (role) member.role = role;
    if (experience) member.experience = experience;

    if (member.socialLinks) {
      if (facebook !== null && facebook !== undefined) member.socialLinks.facebook = facebook;
      if (instagram !== null && instagram !== undefined) member.socialLinks.instagram = instagram;
      if (twitter !== null && twitter !== undefined) member.socialLinks.twitter = twitter;
      if (linkedin !== null && linkedin !== undefined) member.socialLinks.linkedin = linkedin;
    }

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "team");
      member.imageUrl = uploadResult.url;
    }

    await member.save();
    return NextResponse.json(member);
  } catch (error) {
    console.error("Team PUT Error:", error);
    return NextResponse.json({ message: "Failed to update team member", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const member = await Team.findById(params.id);

    if (!member) {
      return NextResponse.json({ message: "Team member not found" }, { status: 404 });
    }

    await member.deleteOne();
    return NextResponse.json({ message: "Team member removed successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete team member", error: error.message }, { status: 500 });
  }
}
