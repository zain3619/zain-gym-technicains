import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import User from "../../../../models/User";

export async function GET(req) {
  try {
    await connectDB();
    const currentUser = await verifyAuth(req);
    
    const user = await User.findById(currentUser._id);
    return NextResponse.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const currentUser = await verifyAuth(req);
    const user = await User.findById(currentUser._id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image");

      if (!file) {
        return NextResponse.json({ message: "No image file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await uploadToCloudinary(buffer, "admin-profiles");
      user.profileImage = uploadResult.url;
      await user.save();

      return NextResponse.json({
        message: "Profile image updated successfully",
        profileImage: user.profileImage,
      });
    } else {
      const { username, email, oldPassword, newPassword } = await req.json();

      if (username) user.username = username;
      if (email) user.email = email;

      if (newPassword) {
        if (!oldPassword) {
          return NextResponse.json({ message: "Please provide old password to set a new password" }, { status: 400 });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
          return NextResponse.json({ message: "Incorrect current password" }, { status: 400 });
        }
        user.password = newPassword;
      }

      await user.save();

      return NextResponse.json({
        message: "Credentials updated successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        },
      });
    }
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
