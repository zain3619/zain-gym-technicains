import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import Video from "../../../../models/Video";

export async function GET(req, context) {
  try {
    await connectDB();
    const params = await context.params;
    const video = await Video.findById(params.id);
    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }
    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch video details", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const video = await Video.findById(params.id);

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const category = formData.get("category");
    const description = formData.get("description");
    const duration = formData.get("duration");
    const sortOrder = formData.get("sortOrder");
    const isActiveStr = formData.get("isActive");

    const videoFile = formData.get("video");
    const thumbnailFile = formData.get("thumbnail");

    if (title !== null && title !== undefined) video.title = title;
    if (category !== null && category !== undefined) video.category = category;
    if (description !== null && description !== undefined) video.description = description;
    if (duration !== null && duration !== undefined) video.duration = duration;
    if (sortOrder !== null && sortOrder !== undefined) video.sortOrder = parseInt(sortOrder, 10);
    if (isActiveStr !== null && isActiveStr !== undefined) {
      video.isActive = isActiveStr === "true" || isActiveStr === "1";
    }

    // Process Video Upload
    if (videoFile && typeof videoFile !== "string" && videoFile.size > 0) {
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "videos", "video");
      video.videoUrl = uploadResult.url;
      video.thumbnailUrl = uploadResult.url.replace(/\.[^/.]+$/, ".jpg");
    }

    // Process Thumbnail Upload
    if (thumbnailFile && typeof thumbnailFile !== "string" && thumbnailFile.size > 0) {
      const bytes = await thumbnailFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "videos", "image");
      video.thumbnailUrl = uploadResult.url;
    }

    await video.save();
    return NextResponse.json(video);
  } catch (error) {
    console.error("Video PUT Error:", error);
    return NextResponse.json({ message: "Failed to update video", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const video = await Video.findById(params.id);

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    await video.deleteOne();
    return NextResponse.json({ message: "Video removed successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete video", error: error.message }, { status: 500 });
  }
}
