import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/browse", destination: "/search", permanent: false },
      { source: "/item/:id", destination: "/rental/:id", permanent: false },
    ];
  },
};

export default nextConfig;
