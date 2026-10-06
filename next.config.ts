import { withSentryConfig } from "@sentry/nextjs";
import { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig = (phase: string): NextConfig => ({
  devIndicators: false,
  trailingSlash: false,
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const rawBackend = process.env.BACKEND_URL || "http://localhost:8080";
    const rawSocket = process.env.SOCKET_URL || "http://localhost:9092";
    const backendUrl = rawBackend.replace(/\/+$/, "");
    const socketUrl = rawSocket.replace(/\/+$/, "");
    return [
      {
        source: "/api/socket_io/:path*",
        destination: `${socketUrl}/api/socket_io/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  headers:
    phase === PHASE_PRODUCTION_BUILD
      ? undefined
      : async () => [
          {
            source: "/engines/:blob*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
              {
                key: "Age",
                value: "181921",
              },
            ],
          },
        ],
});

export default withSentryConfig(nextConfig, {
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  org: process.env.SENTRY_ORG,
  project: "javascript-nextjs",
  widenClientFileUpload: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
    reactComponentAnnotation: {
      enabled: true,
    },
  },
});
