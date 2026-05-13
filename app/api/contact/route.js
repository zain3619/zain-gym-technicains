import nodemailer from "nodemailer";
import { validateContactForm } from "@/app/lib/contact-form";
import { BUSINESS_CONTACT } from "@/app/lib/seo";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function getMailTransportConfig() {
  const host = process.env.SMTP_HOST || "smtp.mail.yahoo.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { values, fieldErrors } = await validateContactForm(body);

    if (fieldErrors) {
      return Response.json(
        {
          message: "Please correct the highlighted fields and try again.",
          fieldErrors,
        },
        { status: 400 },
      );
    }

    const transportConfig = getMailTransportConfig();

    if (!transportConfig) {
      return Response.json(
        {
          message:
            "Email sending is not configured yet. Add SMTP_USER and SMTP_PASS in your environment settings.",
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport(transportConfig);
    const toEmail = process.env.CONTACT_TO_EMAIL || BUSINESS_CONTACT.email;
    const fromEmail =
      process.env.SMTP_FROM || process.env.SMTP_USER || BUSINESS_CONTACT.email;

    await transporter.sendMail({
      to: toEmail,
      from: fromEmail,
      replyTo: values.email,
      subject: `New gym inquiry from ${values.name}`,
      text: [
        `Name: ${values.name}`,
        `Phone: ${values.phone}`,
        `Email: ${values.email}`,
        `Business / Gym Name: ${values.business}`,
        `Project Type: ${values.projectType}`,
        `Budget Range: ${values.budgetRange}`,
        "",
        "Message:",
        values.message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin-bottom: 16px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(values.phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
          <p><strong>Business / Gym Name:</strong> ${escapeHtml(values.business)}</p>
          <p><strong>Project Type:</strong> ${escapeHtml(values.projectType)}</p>
          <p><strong>Budget Range:</strong> ${escapeHtml(values.budgetRange)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(values.message).replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    return Response.json({
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact form email failed:", error);

    return Response.json(
      {
        message:
          "We couldn't send your message right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
