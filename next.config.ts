import type { NextConfig } from "next";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const nextConfig: NextConfig = {
  output: "export", // ⬅️ Add this to disable all SSR (static export)

  webpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash].css",
          chunkFilename: "static/css/[id].[contenthash].css",
        })
      );
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8003",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
