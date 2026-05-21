const Service = require("../models/Service");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services", error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service details", error: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const { title, description, icon, features } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "services");
      imageUrl = uploadResult.url;
    }

    // Handle features parsing (if passed as JSON string or comma-separated list)
    let parsedFeatures = [];
    if (features) {
      if (typeof features === "string") {
        try {
          parsedFeatures = JSON.parse(features);
        } catch {
          parsedFeatures = features.split(",").map(f => f.trim()).filter(Boolean);
        }
      } else if (Array.isArray(features)) {
        parsedFeatures = features;
      }
    }

    const service = await Service.create({
      title,
      description,
      imageUrl,
      icon: icon || "Dumbbell",
      features: parsedFeatures,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service", error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const { title, description, icon, features } = req.body;
    if (title) service.title = title;
    if (description) service.description = description;
    if (icon) service.icon = icon;

    if (features) {
      if (typeof features === "string") {
        try {
          service.features = JSON.parse(features);
        } catch {
          service.features = features.split(",").map(f => f.trim()).filter(Boolean);
        }
      } else if (Array.isArray(features)) {
        service.features = features;
      }
    }

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "services");
      service.imageUrl = uploadResult.url;
    }

    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to update service", error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service", error: error.message });
  }
};
