import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import Settings from "../../../../models/Settings";

export async function GET(req) {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(null, { status: 200 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    await verifyAuth(req);
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const formData = await req.formData();
    const footerText = formData.get("footerText");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const address = formData.get("address");
    const openingHours = formData.get("openingHours");
    const facebook = formData.get("facebook");
    const instagram = formData.get("instagram");
    const youtube = formData.get("youtube");
    const linkedin = formData.get("linkedin");
    const file = formData.get("image");

    if (footerText) settings.footerText = footerText;
    if (phone) settings.phone = phone;
    if (email) settings.email = email;
    if (address) settings.address = address;
    if (openingHours) settings.openingHours = openingHours;

    if (settings.socialLinks) {
      if (facebook !== null && facebook !== undefined) settings.socialLinks.facebook = facebook;
      if (instagram !== null && instagram !== undefined) settings.socialLinks.instagram = instagram;
      if (youtube !== null && youtube !== undefined) settings.socialLinks.youtube = youtube;
      if (linkedin !== null && linkedin !== undefined) settings.socialLinks.linkedin = linkedin;
    }

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "settings");
      settings.logo = uploadResult.url;
    }

    await settings.save();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings PUT Error:", error);
    return NextResponse.json({ message: "Failed to update settings", error: error.message }, { status: 500 });
  }
}
