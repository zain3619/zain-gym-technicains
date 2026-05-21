const Team = require("../models/Team");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper");

exports.getTeam = async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team members", error: error.message });
  }
};

exports.getTeamMemberById = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch team member info", error: error.message });
  }
};

exports.createTeamMember = async (req, res) => {
  try {
    const { name, role, experience, facebook, instagram, twitter, linkedin } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "team");
      imageUrl = uploadResult.url;
    } else {
      return res.status(400).json({ message: "Trainer image file is required" });
    }

    const member = await Team.create({
      name,
      role,
      experience,
      imageUrl,
      socialLinks: {
        facebook: facebook || "",
        instagram: instagram || "",
        twitter: twitter || "",
        linkedin: linkedin || "",
      },
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to create team member", error: error.message });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    const { name, role, experience, facebook, instagram, twitter, linkedin } = req.body;
    if (name) member.name = name;
    if (role) member.role = role;
    if (experience) member.experience = experience;

    if (!member.socialLinks) member.socialLinks = {};
    if (facebook !== undefined) member.socialLinks.facebook = facebook;
    if (instagram !== undefined) member.socialLinks.instagram = instagram;
    if (twitter !== undefined) member.socialLinks.twitter = twitter;
    if (linkedin !== undefined) member.socialLinks.linkedin = linkedin;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "team");
      member.imageUrl = uploadResult.url;
    }

    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Failed to update team member", error: error.message });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Team member not found" });

    await member.deleteOne();
    res.json({ message: "Team member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team member", error: error.message });
  }
};
