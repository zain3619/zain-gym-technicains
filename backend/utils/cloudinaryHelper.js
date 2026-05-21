const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, folderName = "zaingym") => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are not configured properly, bypass with mock for development safety
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY === "mock_key") {
      console.warn("Cloudinary not configured. Simulating asset upload.");
      return resolve({
        url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100)}`,
        publicId: "mock_public_id",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId === "mock_public_id") return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
