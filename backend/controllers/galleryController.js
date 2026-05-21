const Gallery = require("../models/Gallery");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryHelper");

exports.getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    const images = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gallery images", error: error.message });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { category, title } = req.body;
    const uploadedRecords = [];

    for (const file of req.files) {
      const uploadResult = await uploadToCloudinary(file.buffer, "gallery");
      const galleryItem = await Gallery.create({
        title: title || file.originalname.split(".")[0],
        imageUrl: uploadResult.url,
        category: category || "Strength Equipment",
        publicId: uploadResult.publicId,
      });
      uploadedRecords.push(galleryItem);
    }

    res.status(201).json({
      message: "Images uploaded successfully",
      records: uploadedRecords,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload gallery images", error: error.message });
  }
};

exports.editImageTitle = async (req, res) => {
  try {
    const { title, category } = req.body;
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) return res.status(404).json({ message: "Gallery image not found" });

    if (title) galleryItem.title = title;
    if (category) galleryItem.category = category;

    await galleryItem.save();
    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update image", error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) return res.status(404).json({ message: "Gallery image not found" });

    // Delete image asset from Cloudinary
    if (galleryItem.publicId) {
      await deleteFromCloudinary(galleryItem.publicId);
    }

    await galleryItem.deleteOne();
    res.json({ message: "Gallery image removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
};
