import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "cryptologos.cc" },
    ],
  },
  async redirects() {
    return [
      { source: "/stocks", destination: "/plans", permanent: true },
      { source: "/stocks/:path*", destination: "/plans", permanent: true },
      { source: "/funds", destination: "/plans", permanent: true },
      { source: "/funds/:path*", destination: "/plans", permanent: true },
    ];
  },
};

export default nextConfig;
