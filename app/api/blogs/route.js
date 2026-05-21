import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";
import { uploadToCloudinary } from "../../../lib/cloudinary";
import Blog from "../../../models/Blog";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    const query = {};
    if (all !== "true") {
      query.isPublished = true;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch blogs", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    await verifyAuth(req);

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category") || "Fitness";
    const seoTitle = formData.get("seoTitle") || "";
    const seoDescription = formData.get("seoDescription") || "";
    const isPublishedStr = formData.get("isPublished");
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "Please provide blog featured image" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadResult = await uploadToCloudinary(buffer, "blogs");

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const isPublished = isPublishedStr === "true";

    const blog = await Blog.create({
      title,
      slug,
      content,
      featuredImage: uploadResult.url,
      category,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || content.substring(0, 150),
      isPublished,
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Blog POST Error:", error);
    return NextResponse.json({ message: "Failed to create blog post", error: error.message }, { status: 500 });
  }
}
