import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "e47b698e59208764aee00d1d8e14313c.cdn.bubble.io",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/browse", destination: "/search", permanent: false },
      { source: "/item/:id", destination: "/rental/:id", permanent: false },
    ];
  },
};

export default nextConfig;
