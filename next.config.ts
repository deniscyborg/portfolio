import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` writes the finished site to out/, the server only needs nginx
  output: "export",
  // /en/ -> out/en/index.html — nginx serves pages without extra rules
  trailingSlash: true,
  // Image optimisation needs a server; photos are pre-sized in public/images
  images: { unoptimized: true },
  experimental: {
    // Single 404 page: there are two root layouts ([lang] and the "/" redirect)
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
