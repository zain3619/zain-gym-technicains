import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import ContactMessage from "../../../../models/ContactMessage";

export async function DELETE(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const msg = await ContactMessage.findById(params.id);

    if (!msg) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    await msg.deleteOne();
    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete message", error: error.message }, { status: 500 });
  }
}
