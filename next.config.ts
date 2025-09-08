import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    /** Allow production builds to succeed even if ESLint has errors. */
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
