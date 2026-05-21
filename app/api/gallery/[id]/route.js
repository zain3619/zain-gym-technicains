import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { deleteFromCloudinary } from "../../../../lib/cloudinary";
import Gallery from "../../../../models/Gallery";

export async function DELETE(req, context) {
  try {
    await connectDB();
    await verifyAuth(req);
    const params = await context.params;
    const item = await Gallery.findById(params.id);

    if (!item) {
      return NextResponse.json({ message: "Gallery item not found" }, { status: 404 });
    }

    if (item.publicId) {
      await deleteFromCloudinary(item.publicId);
    }

    await item.deleteOne();
    return NextResponse.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete gallery item", error: error.message }, { status: 500 });
  }
}
