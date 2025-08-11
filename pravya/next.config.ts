import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint : {
    ignoreDuringBuilds : true
  },
  typescript : {
    ignoreBuildErrors : true
  },
  devIndicators: {
    buildActivity: false,
  },
};

export default nextConfig;
