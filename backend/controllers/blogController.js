const Blog = require("../models/Blog");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

exports.getBlogs = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, all = "false" } = req.query;

    const query = {};
    if (all !== "true") {
      query.isPublished = true;
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skipIndex = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skipIndex);

    res.json({
      blogs,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog post", error: error.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, slug, content, category, seoTitle, seoDescription, isPublished } = req.body;
    let featuredImage = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "blogs");
      featuredImage = uploadResult.url;
    } else {
      return res.status(400).json({ message: "Featured image is required for blogs" });
    }

    // Dynamic slug backup if none passed
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const blog = await Blog.create({
      title,
      slug: finalSlug,
      content,
      featuredImage,
      category: category || "Fitness",
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || content.substring(0, 150).replace(/<[^>]*>/g, ""),
      isPublished: isPublished === "true" || isPublished === true,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const { title, slug, content, category, seoTitle, seoDescription, isPublished } = req.body;

    if (title) blog.title = title;
    if (slug) blog.slug = slug;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (seoTitle) blog.seoTitle = seoTitle;
    if (seoDescription) blog.seoDescription = seoDescription;
    if (isPublished !== undefined) blog.isPublished = isPublished === "true" || isPublished === true;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "blogs");
      blog.featuredImage = uploadResult.url;
    }

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog", error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.deleteOne();
    res.json({ message: "Blog post removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog post", error: error.message });
  }
};
