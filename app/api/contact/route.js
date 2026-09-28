import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { AuthError, verifyAuth } from "../../../lib/auth";
import ContactMessage from "../../../models/ContactMessage";
import { sendInquiryEmail } from "../../../lib/email";
import {
  createLocalInquiry,
  listLocalInquiries,
} from "../../../lib/localInquiries";

function authFail(error) {
  const status = error instanceof AuthError ? error.status : 401;
  return NextResponse.json(
    { message: error.message || "Not authorized" },
    { status }
  );
}

function mergeMessages(mongoDocs, localDocs) {
  const map = new Map();
  for (const doc of localDocs || []) {
    map.set(String(doc._id), doc);
  }
  for (const doc of mongoDocs || []) {
    const plain = typeof doc.toObject === "function" ? doc.toObject() : doc;
    map.set(String(plain._id), plain);
  }
  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

export async function GET(req) {
  try {
    await verifyAuth(req);
  } catch (error) {
    return authFail(error);
  }

  let mongoMessages = [];
  let localMessages = [];

  try {
    await connectDB();
    mongoMessages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  } catch (dbError) {
    console.warn("Contact GET Mongo skipped:", dbError.message);
  }

  try {
    localMessages = await listLocalInquiries();
  } catch (localError) {
    console.warn("Contact GET local skipped:", localError.message);
  }

  return NextResponse.json(mergeMessages(mongoMessages, localMessages));
}

export async function POST(req) {
  try {
    const { name, phone, email, business, projectType, budgetRange, message } =
      await req.json();

    if (
      !name ||
      !phone ||
      !email ||
      !business ||
      !projectType ||
      !budgetRange ||
      !message
    ) {
      return NextResponse.json(
        { message: "All input fields are required" },
        { status: 400 }
      );
    }

    const payload = {
      name,
      phone,
      email,
      business,
      projectType,
      budgetRange,
      message,
    };

    let newMessage = null;
    let savedTo = null;

    try {
      await connectDB();
      newMessage = await ContactMessage.create(payload);
      savedTo = "mongo";
    } catch (dbError) {
      console.warn(
        "Mongo unavailable for contact POST, using local store:",
        dbError.message
      );
      try {
        newMessage = await createLocalInquiry(payload);
        savedTo = "local";
      } catch (localError) {
        console.error("Local inquiry save failed:", localError);
      }
    }

    let emailResult = { sent: false, error: "not attempted" };
    try {
      emailResult = await sendInquiryEmail(payload);
      if (!emailResult.sent) {
        console.warn("Inquiry email not sent:", emailResult.error);
      }
    } catch (emailError) {
      console.warn("Inquiry email error:", emailError?.message || emailError);
      emailResult = {
        sent: false,
        error: emailError?.message || "Email failed",
      };
    }

    if (!newMessage && !emailResult.sent) {
      return NextResponse.json(
        {
          message:
            "Could not save inquiry right now. Please call or WhatsApp us directly.",
          error: "database and email both unavailable",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        message: "Inquiry submitted successfully",
        newMessage,
        emailSent: Boolean(emailResult.sent),
        savedTo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact Message POST Error:", error);
    return NextResponse.json(
      { message: "Failed to submit inquiry", error: error.message },
      { status: 500 }
    );
  }
}
