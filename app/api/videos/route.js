import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import Video from "../../../models/Video";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    
    const filter = {};
    if (!isAdmin) {
      filter.isActive = true;
    }
    
    const videos = await Video.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Video GET Error:", error);
    return NextResponse.json({ message: "Failed to fetch videos", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    await verifyAuth(req);

    const formData = await req.formData();
    const title = formData.get("title");
    const category = formData.get("category") || "General";
    const description = formData.get("description") || "";
    const duration = formData.get("duration") || "0:00";
    const sortOrder = parseInt(formData.get("sortOrder") || "0", 10);
    const isActive = formData.get("isActive") === "true" || formData.get("isActive") === "1" || formData.get("isActive") === null;

    const videoFile = formData.get("video");
    const thumbnailFile = formData.get("thumbnail");
    let videoUrl = formData.get("videoUrl") || "";
    let thumbnailUrl = formData.get("thumbnailUrl") || "";

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    // Process Video Upload
    if (videoFile && typeof videoFile !== "string" && videoFile.size > 0) {
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "videos", "video");
      videoUrl = uploadResult.url;
    }

    // Process Thumbnail Upload
    if (thumbnailFile && typeof thumbnailFile !== "string" && thumbnailFile.size > 0) {
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "videos", "image");
      thumbnailUrl = uploadResult.url;
    }

    if (!videoUrl) {
      return NextResponse.json({ message: "Video file or video URL is required" }, { status: 400 });
    }

    if (!thumbnailUrl) {
      // Auto-derive poster image from Cloudinary video URL by replacing format extensions with .jpg
      thumbnailUrl = videoUrl.replace(/\.[^/.]+$/, ".jpg");
    }

    if (!thumbnailUrl) {
      thumbnailUrl = "/hero-gym.png";
    }

    const video = await Video.create({
      title,
      category,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
      sortOrder,
      isActive,
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Video POST Error:", error);
    return NextResponse.json({ message: "Failed to create video", error: error.message }, { status: 500 });
  }
}
