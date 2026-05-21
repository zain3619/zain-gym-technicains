const Hero = require("../models/Hero");
const About = require("../models/About");
const Settings = require("../models/Settings");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

// ================= HERO =================
exports.getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hero section", error: error.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero({});
    }

    const { heading, subheading, ctaText1, ctaLink1, ctaText2, ctaLink2 } = req.body;
    if (heading) hero.heading = heading;
    if (subheading) hero.subheading = subheading;
    if (ctaText1) hero.ctaText1 = ctaText1;
    if (ctaLink1) hero.ctaLink1 = ctaLink1;
    if (ctaText2) hero.ctaText2 = ctaText2;
    if (ctaLink2) hero.ctaLink2 = ctaLink2;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "hero");
      hero.backgroundImage = uploadResult.url;
    }

    await hero.save();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: "Failed to update hero section", error: error.message });
  }
};

// ================= ABOUT =================
exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch about section", error: error.message });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({});
    }

    const { title, description, experienceYears, gymsBuilt, clientSatisfaction } = req.body;
    if (title) about.title = title;
    if (description) about.description = description;
    if (experienceYears) about.experienceYears = Number(experienceYears);
    if (gymsBuilt) about.gymsBuilt = Number(gymsBuilt);
    if (clientSatisfaction) about.clientSatisfaction = clientSatisfaction;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "about");
      about.imageUrl = uploadResult.url;
    }

    await about.save();
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: "Failed to update about section", error: error.message });
  }
};

// ================= SETTINGS =================
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings", error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    const { footerText, phone, email, address, openingHours, facebook, instagram, youtube, linkedin } = req.body;
    if (footerText) settings.footerText = footerText;
    if (phone) settings.phone = phone;
    if (email) settings.email = email;
    if (address) settings.address = address;
    if (openingHours) settings.openingHours = openingHours;

    if (!settings.socialLinks) settings.socialLinks = {};
    if (facebook !== undefined) settings.socialLinks.facebook = facebook;
    if (instagram !== undefined) settings.socialLinks.instagram = instagram;
    if (youtube !== undefined) settings.socialLinks.youtube = youtube;
    if (linkedin !== undefined) settings.socialLinks.linkedin = linkedin;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "settings");
      settings.logo = uploadResult.url;
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings", error: error.message });
  }
};
