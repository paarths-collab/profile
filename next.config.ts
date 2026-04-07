import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/basic-info",
        destination: "http://127.0.0.1:8000/basic-info",
      },
      {
        source: "/projects",
        destination: "http://127.0.0.1:8000/projects",
      },
      {
        source: "/experiences",
        destination: "http://127.0.0.1:8000/experiences",
      },
      {
        source: "/skills",
        destination: "http://127.0.0.1:8000/skills",
      },
      {
        source: "/hobbies",
        destination: "http://127.0.0.1:8000/hobbies",
      },
      {
        source: "/token",
        destination: "http://127.0.0.1:8000/token",
      },
      {
        source: "/register",
        destination: "http://127.0.0.1:8000/register",
      },
      {
        source: "/static/:path*",
        destination: "http://127.0.0.1:8000/static/:path*",
      },
    ];
  },
};

export default nextConfig;
