import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { verifyAuth } from "../../../lib/auth";
import ContactMessage from "../../../models/ContactMessage";

export async function GET(req) {
  try {
    await connectDB();
    await verifyAuth(req);

    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch messages", error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { name, phone, email, business, projectType, budgetRange, message } = await req.json();

    if (!name || !phone || !email || !business || !projectType || !budgetRange || !message) {
      return NextResponse.json({ message: "All input fields are required" }, { status: 400 });
    }

    const newMessage = await ContactMessage.create({
      name,
      phone,
      email,
      business,
      projectType,
      budgetRange,
      message,
    });

    return NextResponse.json({ message: "Inquiry submitted successfully", newMessage }, { status: 201 });
  } catch (error) {
    console.error("Contact Message POST Error:", error);
    return NextResponse.json({ message: "Failed to submit inquiry", error: error.message }, { status: 500 });
  }
}
