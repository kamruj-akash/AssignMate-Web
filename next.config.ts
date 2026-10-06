import type { NextConfig } from "next";

// In production the browser calls /api/v1/* on this domain and Next forwards it
// to the backend, so auth cookies are first-party and readable by proxy.ts.
const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    if (!backendUrl) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
