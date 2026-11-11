const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.VERCEL ? {} : { outputFileTracingRoot: path.join(__dirname) }),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vlkofzfbfbropigptpee.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

module.exports = nextConfig;
