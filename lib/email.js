import { Resend } from "resend";
import { BUSINESS_CONTACT, COMPANY_NAME } from "../app/lib/seo";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function buildInquiryEmailHtml(data) {
  const rows = [
    ["Full Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Business / Gym", data.business],
    ["Project Type", data.projectType],
    ["Budget Range", data.budgetRange],
    ["Message", data.message],
  ];

  const body = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #222;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;width:160px;vertical-align:top;">${label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #222;color:#f5f5f5;font-size:14px;white-space:pre-wrap;">${String(value || "—").replace(/</g, "&lt;")}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="background:#0a0a0a;padding:32px 16px;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#111;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid #2a2a2a;">
        <p style="margin:0;color:#82cd2b;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;">New Quote Inquiry</p>
        <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">${COMPANY_NAME}</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;">${body}</table>
      <div style="padding:16px 28px;color:#777;font-size:12px;">
        Submitted via website Get Quote / Contact form.
      </div>
    </div>
  </div>`;
}

/**
 * Send inquiry email via Resend. Returns { sent, id?, error? }.
 * Does not throw — caller can still save to DB if email fails.
 */
export async function sendInquiryEmail(data) {
  const resend = getResend();
  const to =
    process.env.CONTACT_TO_EMAIL ||
    process.env.SMTP_USER ||
    BUSINESS_CONTACT.email;
  const from =
    process.env.RESEND_FROM ||
    process.env.SMTP_FROM ||
    `${COMPANY_NAME} <onboarding@resend.dev>`;

  if (!resend) {
    return { sent: false, error: "RESEND_API_KEY missing" };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: `New Quote — ${data.business || data.name} (${data.projectType || "Inquiry"})`,
      html: buildInquiryEmailHtml(data),
      text: [
        `New quote inquiry from ${data.name}`,
        `Phone: ${data.phone}`,
        `Email: ${data.email}`,
        `Business: ${data.business}`,
        `Project Type: ${data.projectType}`,
        `Budget: ${data.budgetRange}`,
        `Message: ${data.message}`,
      ].join("\n"),
    });

    if (result.error) {
      return { sent: false, error: result.error.message || String(result.error) };
    }

    return { sent: true, id: result.data?.id };
  } catch (error) {
    return { sent: false, error: error.message || "Email send failed" };
  }
}
