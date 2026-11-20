import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves the site under /product-checklists; locally it stays at the root.
  basePath: process.env.PAGES_BASE_PATH ?? "",
  // Optional: build into another folder when "out" is locked on Windows (EXPORT_DIR=out2 npm run build).
  ...(process.env.EXPORT_DIR ? { distDir: process.env.EXPORT_DIR } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
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
