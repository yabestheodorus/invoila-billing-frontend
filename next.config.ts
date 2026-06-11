import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Business logos are hosted on Cloudinary; allow next/image to load them.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
