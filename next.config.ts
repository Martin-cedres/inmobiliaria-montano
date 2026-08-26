import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/propiedad/:slug.md',
        destination: '/api/markdown/propiedad/:slug',
      },
    ];
  },
};

export default nextConfig;
