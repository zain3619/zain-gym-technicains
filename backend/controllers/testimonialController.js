const Testimonial = require("../models/Testimonial");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials", error: error.message });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, text, rating } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "testimonials");
      imageUrl = uploadResult.url;
    }

    const testimonial = await Testimonial.create({
      name,
      role,
      text,
      rating: Number(rating) || 5,
      imageUrl,
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Failed to create testimonial", error: error.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    const { name, role, text, rating } = req.body;
    if (name) testimonial.name = name;
    if (role) testimonial.role = role;
    if (text) testimonial.text = text;
    if (rating) testimonial.rating = Number(rating);

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "testimonials");
      testimonial.imageUrl = uploadResult.url;
    }

    await testimonial.save();
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Failed to update testimonial", error: error.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    await testimonial.deleteOne();
    res.json({ message: "Testimonial removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete testimonial", error: error.message });
  }
};
