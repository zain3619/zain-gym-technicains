import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import Hero from "../../../../models/Hero";

export async function GET(req) {
  try {
    await connectDB();
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }
    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json(null, { status: 200 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    await verifyAuth(req);
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }

    const formData = await req.formData();
    const heading = formData.get("heading");
    const subheading = formData.get("subheading");
    const ctaText1 = formData.get("ctaText1");
    const ctaLink1 = formData.get("ctaLink1");
    const ctaText2 = formData.get("ctaText2");
    const ctaLink2 = formData.get("ctaLink2");
    const file = formData.get("image");

    if (heading) hero.heading = heading;
    if (subheading) hero.subheading = subheading;
    if (ctaText1) hero.ctaText1 = ctaText1;
    if (ctaLink1) hero.ctaLink1 = ctaLink1;
    if (ctaText2) hero.ctaText2 = ctaText2;
    if (ctaLink2) hero.ctaLink2 = ctaLink2;

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "hero-video", "video");
      hero.backgroundImage = uploadResult.url;
    }

    await hero.save();
    return NextResponse.json(hero);
  } catch (error) {
    console.error("Hero PUT Error:", error);
    return NextResponse.json({ message: "Failed to update hero settings", error: error.message }, { status: 500 });
  }
}
