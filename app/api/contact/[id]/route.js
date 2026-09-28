import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { AuthError, verifyAuth } from "../../../../lib/auth";
import ContactMessage from "../../../../models/ContactMessage";
import {
  deleteLocalInquiry,
  updateLocalInquiry,
} from "../../../../lib/localInquiries";

function authFail(error) {
  const status = error instanceof AuthError ? error.status : 401;
  return NextResponse.json(
    { message: error.message || "Not authorized" },
    { status }
  );
}

function buildPatch(body) {
  const patch = {};
  if (typeof body.isRead === "boolean") patch.isRead = body.isRead;
  if (typeof body.isDone === "boolean") {
    patch.isDone = body.isDone;
    if (body.isDone) patch.isRead = true;
  }
  return patch;
}

export async function PUT(req, context) {
  try {
    await verifyAuth(req);
  } catch (error) {
    return authFail(error);
  }

  try {
    const params = await context.params;
    const body = await req.json();
    const patch = buildPatch(body);

    try {
      await connectDB();
      const msg = await ContactMessage.findById(params.id);

      if (!msg) {
        const local = await updateLocalInquiry(params.id, patch);
        if (!local) {
          return NextResponse.json(
            { message: "Message not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({
          message: local.isDone ? "Marked as done" : "Ticket updated",
          messageDoc: local,
        });
      }

      if (typeof patch.isRead === "boolean") msg.isRead = patch.isRead;
      if (typeof patch.isDone === "boolean") msg.isDone = patch.isDone;

      await msg.save();
      return NextResponse.json({
        message: msg.isDone ? "Marked as done" : "Ticket updated",
        messageDoc: msg,
      });
    } catch (dbError) {
      const local = await updateLocalInquiry(params.id, patch);
      if (!local) {
        return NextResponse.json(
          { message: "Message not found", error: dbError.message },
          { status: 404 }
        );
      }
      return NextResponse.json({
        message: local.isDone ? "Marked as done" : "Ticket updated",
        messageDoc: local,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update message", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    await verifyAuth(req);
  } catch (error) {
    return authFail(error);
  }

  try {
    const params = await context.params;

    try {
      await connectDB();
      const msg = await ContactMessage.findById(params.id);

      if (msg) {
        await msg.deleteOne();
        return NextResponse.json({ message: "Message deleted successfully" });
      }

      const deletedLocal = await deleteLocalInquiry(params.id);
      if (!deletedLocal) {
        return NextResponse.json(
          { message: "Message not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Message deleted successfully" });
    } catch (dbError) {
      const deletedLocal = await deleteLocalInquiry(params.id);
      if (!deletedLocal) {
        return NextResponse.json(
          { message: "Message not found", error: dbError.message },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: "Message deleted successfully" });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete message", error: error.message },
      { status: 500 }
    );
  }
}
