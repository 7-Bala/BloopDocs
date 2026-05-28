import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: process.env.ELECTRON_BUILD === "true" ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.ELECTRON_BUILD === "true" ? "./" : undefined,
};

export default nextConfig;
