import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "e47b698e59208764aee00d1d8e14313c.cdn.bubble.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/browse", destination: "/search", permanent: false },
      { source: "/item/:id", destination: "/listing/:id", permanent: false },
      { source: "/rental/:id", destination: "/listing/:id", permanent: false },
    ];
  },
};

export default nextConfig;
