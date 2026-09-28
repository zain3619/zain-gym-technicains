import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { verifyAuth } from "../../../../lib/auth";
import { uploadToCloudinary } from "../../../../lib/cloudinary";
import User from "../../../../models/User";
import {
  readLocalProfile,
  writeLocalProfile,
  saveLocalProfileImage,
} from "../../../../lib/localAdminProfile";

function shapeUser(user) {
  return {
    id: user._id || user.id,
    _id: user._id || user.id,
    username: user.username || "Admin",
    email: user.email || "admin@zaingym.com",
    role: user.role || "admin",
    profileImage: user.profileImage || "",
  };
}

export async function GET(req) {
  try {
    const currentUser = await verifyAuth(req);

    // Offline / DB-down path
    if (currentUser._offline) {
      const local = (await readLocalProfile()) || {};
      return NextResponse.json(
        shapeUser({
          ...currentUser,
          ...local,
          profileImage: local.profileImage || currentUser.profileImage || "",
        })
      );
    }

    try {
      await connectDB();
      const user = await User.findById(currentUser._id).select("-password");
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
      return NextResponse.json(shapeUser(user));
    } catch (dbError) {
      console.warn("Profile GET using local store:", dbError.message);
      const local = (await readLocalProfile()) || {};
      return NextResponse.json(
        shapeUser({
          ...currentUser,
          ...local,
          profileImage: local.profileImage || "",
        })
      );
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}

export async function PUT(req) {
  try {
    const currentUser = await verifyAuth(req);
    const contentType = req.headers.get("content-type") || "";

    // ── Image upload ──
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image");

      if (!file || typeof file === "string") {
        return NextResponse.json(
          { message: "No image file provided" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      let imageUrl = "";

      // Prefer Cloudinary when available; always have local fallback
      try {
        const uploadResult = await uploadToCloudinary(buffer, "admin-profiles");
        if (
          uploadResult?.url &&
          !String(uploadResult.url).includes("picsum.photos")
        ) {
          imageUrl = uploadResult.url;
        }
      } catch (uploadError) {
        console.warn("Cloudinary profile upload failed:", uploadError.message);
      }

      if (!imageUrl) {
        imageUrl = await saveLocalProfileImage(buffer, file.name || "avatar.jpg");
      }

      // Try Mongo save
      try {
        if (!currentUser._offline) {
          await connectDB();
          const user = await User.findById(currentUser._id);
          if (user) {
            user.profileImage = imageUrl;
            await user.save();
            const shaped = shapeUser(user);
            return NextResponse.json({
              message: "Profile image updated successfully",
              profileImage: imageUrl,
              user: shaped,
            });
          }
        }
      } catch (dbError) {
        console.warn(
          "Mongo unavailable for profile PUT, saving locally:",
          dbError.message
        );
      }

      // Local profile persistence
      const existing = (await readLocalProfile()) || {};
      const localUser = await writeLocalProfile({
        ...existing,
        id: currentUser._id || existing.id,
        _id: currentUser._id || existing._id,
        username: existing.username || currentUser.username || "Admin",
        email: existing.email || currentUser.email || "admin@zaingym.com",
        role: existing.role || currentUser.role || "admin",
        profileImage: imageUrl,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        message: "Profile image updated successfully",
        profileImage: imageUrl,
        user: shapeUser(localUser),
        savedTo: "local",
      });
    }

    // ── Credentials update ──
    const { username, email, oldPassword, newPassword } = await req.json();

    try {
      if (currentUser._offline) {
        throw new Error("database offline");
      }
      await connectDB();
      const user = await User.findById(currentUser._id);
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      if (username) user.username = username;
      if (email) user.email = email;

      if (newPassword) {
        if (!oldPassword) {
          return NextResponse.json(
            { message: "Please provide old password to set a new password" },
            { status: 400 }
          );
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
          return NextResponse.json(
            { message: "Incorrect current password" },
            { status: 400 }
          );
        }
        user.password = newPassword;
      }

      await user.save();

      return NextResponse.json({
        message: "Credentials updated successfully",
        user: shapeUser(user),
      });
    } catch (dbError) {
      // Offline credential updates (username/email only — not password hashing)
      if (newPassword) {
        return NextResponse.json(
          {
            message:
              "Database is offline. Password changes require MongoDB connection.",
          },
          { status: 503 }
        );
      }

      const existing = (await readLocalProfile()) || {};
      const localUser = await writeLocalProfile({
        ...existing,
        id: currentUser._id || existing.id,
        _id: currentUser._id || existing._id,
        username: username || existing.username || currentUser.username || "Admin",
        email: email || existing.email || currentUser.email || "admin@zaingym.com",
        role: existing.role || currentUser.role || "admin",
        profileImage: existing.profileImage || "",
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        message: "Credentials updated locally (Mongo offline)",
        user: shapeUser(localUser),
        savedTo: "local",
      });
    }
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
