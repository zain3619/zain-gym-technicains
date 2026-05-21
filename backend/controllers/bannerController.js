const Banner = require("../models/Banner");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

exports.getBanners = async (req, res) => {
  try {
    const filter = req.query.active === "true" ? { isActive: true } : {};
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch banners", error: error.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const { title, type, isActive, order } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "banners");
      imageUrl = uploadResult.url;
    } else {
      return res.status(400).json({ message: "Banner image file is required" });
    }

    const banner = await Banner.create({
      title,
      imageUrl,
      type: type || "homepage",
      isActive: isActive === "true" || isActive === true || isActive === undefined,
      order: Number(order) || 0,
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Failed to create banner", error: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    const { title, type, isActive, order } = req.body;
    if (title) banner.title = title;
    if (type) banner.type = type;
    if (isActive !== undefined) banner.isActive = isActive === "true" || isActive === true;
    if (order !== undefined) banner.order = Number(order);

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "banners");
      banner.imageUrl = uploadResult.url;
    }

    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: "Failed to update banner", error: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    await banner.deleteOne();
    res.json({ message: "Banner removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete banner", error: error.message });
  }
};
