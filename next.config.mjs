/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "t4.ftcdn.net" },
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "s3-media0.fl.yelpcdn.com" },
      { protocol: "https", hostname: "thefitnessoutlet.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "www.hussle.com" },
    ],
  },
};

export default nextConfig;
