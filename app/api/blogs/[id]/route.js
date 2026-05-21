import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import Blog from "../../../../models/Blog";

export async function GET(req, context) {
  try {
    await connectDB();
    const params = await context.params;
    
    let blog = await Blog.findById(params.id).catch(() => null);
    if (!blog) {
      blog = await Blog.findOne({ slug: params.id });
    }

    if (!blog) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch blog details", error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    const seoTitle = formData.get("seoTitle");
    const seoDescription = formData.get("seoDescription");
    const isPublishedStr = formData.get("isPublished");
    const file = formData.get("image");

    if (title) {
      blog.title = title;
      blog.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (seoTitle) blog.seoTitle = seoTitle;
    if (seoDescription) blog.seoDescription = seoDescription;
    
    if (isPublishedStr !== null && isPublishedStr !== undefined) {
      blog.isPublished = isPublishedStr === "true";
    }

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await uploadToCloudinary(buffer, "blogs");
      blog.featuredImage = uploadResult.url;
    }

    await blog.save();
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Blog PUT Error:", error);
    return NextResponse.json({ message: "Failed to update blog post", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const blog = await Blog.findById(params.id);

    if (!blog) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    await blog.deleteOne();
    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete blog post", error: error.message }, { status: 500 });
  }
}
