import { v2 as cloudinary } from "cloudinary";
import { convertImageToWebp } from "./optimizeMedia";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(buffer, folderName = "zaingym", resourceType = "auto") {
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY === "mock_key") {
    console.warn("Cloudinary not configured. Simulating asset upload.");
    const isVid =
      resourceType === "video" ||
      folderName === "about-video" ||
      folderName === "hero-video";
    return {
      url: isVid
        ? "/gym-hero-bg.mp4"
        : "/hero-gym.webp",
      publicId: "mock_public_id",
    };
  }

  let optimizedBuffer = buffer;
  const isVideo =
    resourceType === "video" ||
    folderName === "about-video" ||
    folderName === "hero-video";

  if (!isVideo) {
    const converted = await convertImageToWebp(buffer, { quality: 84 });
    optimizedBuffer = converted.buffer;
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folderName,
      resource_type: isVideo ? "video" : "image",
    };

    if (!isVideo) {
      uploadOptions.format = "webp";
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return reject(error);
        }

        let url = result.secure_url;
        if (isVideo && url.includes("/video/upload/")) {
          url = url.replace(/\.[^/.]+$/, ".mp4");
          url = url.replace(
            "/video/upload/",
            "/video/upload/q_auto:eco,f_auto,vc_h264,br_1200k,w_1920,c_limit/"
          );
        }

        resolve({
          url,
          publicId: result.public_id,
        });
      }
    );
    uploadStream.end(optimizedBuffer);
  });
}

export async function deleteFromCloudinary(publicId) {
  if (!publicId || publicId === "mock_public_id") return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error.message);
  }
}
