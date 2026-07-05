import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile in the home dir doesn't confuse Next.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
