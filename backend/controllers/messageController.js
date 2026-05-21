const ContactMessage = require("../models/ContactMessage");
const nodemailer = require("nodemailer");
const Settings = require("../models/Settings");

// Helper to secure SMTP configs dynamically from process.env or settings db
const getMailTransporter = async () => {
  const host = process.env.SMTP_HOST || "smtp.mail.yahoo.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact messages", error: error.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { name, phone, email, business, projectType, budgetRange, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({ message: "Required fields are missing: name, phone, email, message" });
    }

    const newMessage = await ContactMessage.create({
      name,
      phone,
      email,
      business: business || "N/A",
      projectType: projectType || "N/A",
      budgetRange: budgetRange || "N/A",
      message,
    });

    // Try sending email in background
    try {
      const transporter = await getMailTransporter();
      if (transporter) {
        const toEmail = process.env.CONTACT_TO_EMAIL || "m.qaiser76@yahoo.com";
        const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || toEmail;

        await transporter.sendMail({
          to: toEmail,
          from: fromEmail,
          replyTo: email,
          subject: `New Zain Gym Inquiry from ${name}`,
          text: `
Name: ${name}
Phone: ${phone}
Email: ${email}
Business / Gym Name: ${business || "N/A"}
Project Type: ${projectType || "N/A"}
Budget Range: ${budgetRange || "N/A"}

Message:
${message}
          `,
          html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
              <h2>New Contact Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Business / Gym:</strong> ${business || "N/A"}</p>
              <p><strong>Project Type:</strong> ${projectType || "N/A"}</p>
              <p><strong>Budget Range:</strong> ${budgetRange || "N/A"}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-line;">${message}</p>
            </div>
          `,
        });
        console.log("Mailing completed successfully.");
      } else {
        console.warn("Mailing server not configured yet.");
      }
    } catch (mailError) {
      console.error("Nodemailer routing failed:", mailError.message);
    }

    res.status(201).json({
      message: "Message logged successfully.",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to log contact inquiry", error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    message.isRead = req.body.isRead !== undefined ? req.body.isRead : true;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle message read status", error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    await message.deleteOne();
    res.json({ message: "Message deleted from index" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove message record", error: error.message });
  }
};
