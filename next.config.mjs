/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
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
