import { v2 as cloudinary } from "cloudinary";

import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(buffer, folderName = "zaingym", resourceType = "auto") {
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY === "mock_key") {
    console.warn("Cloudinary not configured. Simulating asset upload.");
    return {
      url: resourceType === "video" || folderName === "about-video" ? "https://res.cloudinary.com/dpfeinyyb/video/upload/v1779368324/mock-video.mp4" : `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`,
      publicId: "mock_public_id",
    };
  }

  let optimizedBuffer = buffer;
  const isVideo = resourceType === "video" || folderName === "about-video" || folderName === "hero-video";

  if (!isVideo) {
    try {
      // Convert to high-quality optimized WebP buffer
      optimizedBuffer = await sharp(buffer)
        .webp({ 
          quality: 90, // Exceptional visual quality
          effort: 6,   // Highest compression
        })
        .toBuffer();
      console.log("Image dynamically converted to optimized high-fidelity WebP!");
    } catch (error) {
      console.warn("Sharp WebP conversion failed, falling back to original buffer:", error.message);
    }
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = { 
      folder: folderName,
      resource_type: isVideo ? "video" : "image"
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
        // Apply optimal streaming compression dynamically on CDN edge for lag-free delivery
        if (isVideo && url.includes("/video/upload/")) {
          // Replace any format extension (e.g. .mov, .webm, .avi) with .mp4 to guarantee universal HTML5 playback
          url = url.replace(/\.[^/.]+$/, ".mp4");
          url = url.replace("/video/upload/", "/video/upload/q_auto,f_auto,vc_h264,br_1500k/");
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
