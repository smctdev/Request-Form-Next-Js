import type { NextConfig } from "next";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const nextConfig: NextConfig = {
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
        protocol: "http",
        hostname: "localhost",
        port: "5002",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "requestserver.smctgroup",
        pathname: "/storage/**", // Or "/**" if you serve images outside /storage
      },
    ],
  },
};

export default nextConfig;
